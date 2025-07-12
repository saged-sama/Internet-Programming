from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List, Optional
from datetime import date, datetime
import uuid
import stripe
import os
from pydantic import BaseModel

from ..utils.db import get_session
from ..utils.auth import get_current_user
from ..models.fee import (
    Fee, FeePayment, StudentFee, StripePaymentIntent,
    FeeTypeEnum, FeeStatusEnum, PaymentMethodEnum
)
from ..models.user import User, StudentProfile

# Configure Stripe
stripe.api_key = os.getenv("STRIPE_SECRET_KEY", "sk_test_...")

router = APIRouter(prefix="/api/financials", tags=["financials"])

# Mock admin user for development
def get_mock_admin_user():
    return User(
        id="admin-mock",
        name="Mock Admin",
        role="admin",
        email="admin@dev.local"
    )

# Development authentication dependency
async def get_current_user_or_mock(session: Session = Depends(get_session)):
    """Get current user from authentication or return mock admin for development"""
    try:
        # For development, we'll just return a mock admin user
        # In production, you'd use the real authentication
        return get_mock_admin_user()
    except Exception:
        # Fallback to mock admin if authentication fails
        return get_mock_admin_user()

# Pydantic models for requests/responses
class FeeCreate(BaseModel):
    title: str
    description: Optional[str] = None
    type: FeeTypeEnum
    amount: float
    deadline: date
    semester: Optional[str] = None
    academic_year: Optional[str] = None
    is_installment_available: bool = False
    installment_count: Optional[int] = None
    installment_amount: Optional[float] = None

class FeeUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    type: Optional[FeeTypeEnum] = None
    amount: Optional[float] = None
    deadline: Optional[date] = None
    semester: Optional[str] = None
    academic_year: Optional[str] = None
    is_installment_available: Optional[bool] = None
    installment_count: Optional[int] = None
    installment_amount: Optional[float] = None

class FeeResponse(BaseModel):
    id: str
    title: str
    description: Optional[str]
    amount: float
    deadline: date
    status: FeeStatusEnum
    transaction_id: Optional[str] = None
    payment_date: Optional[datetime] = None
    category: str  # maps to type
    semester: Optional[str]
    academic_year: Optional[str]
    installment_options: Optional[dict] = None

class PaymentIntentCreate(BaseModel):
    student_fee_id: str
    amount: float
    currency: str = "usd"

class PaymentConfirm(BaseModel):
    payment_intent_id: str
    payment_method_id: str

# Student endpoints
@router.get("/fees/my-fees", response_model=List[FeeResponse])
async def get_my_fees(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user_or_mock)
):
    """Get all fees for the current student or admin"""
    
    # If admin, return all fees for management purposes
    if current_user.role == "admin":
        # Get all fees from the database
        all_fees = session.exec(select(Fee)).all()
        
        fees = []
        for fee in all_fees:
            fee_response = FeeResponse(
                id=fee.id,
                title=fee.title,
                description=fee.description,
                amount=fee.amount,
                deadline=fee.deadline,
                status=FeeStatusEnum.pending,  # Default status for admin view
                category=fee.type.value,
                semester=fee.semester,
                academic_year=fee.academic_year,
                installment_options={
                    "count": fee.installment_count,
                    "amount": fee.installment_amount
                } if fee.is_installment_available and fee.installment_count else None
            )
            fees.append(fee_response)
        
        return fees
    
    # Student logic
    if current_user.role != "student":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only students and admins can access fees"
        )
    
    # Get student profile
    student_profile = session.exec(
        select(StudentProfile).where(StudentProfile.user_id == current_user.id)
    ).first()
    
    if not student_profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student profile not found"
        )
    
    # Get student fees with associated fee and payment info
    student_fees_query = select(StudentFee, Fee, FeePayment).join(
        Fee, StudentFee.fee_id == Fee.id, isouter=False
    ).join(
        FeePayment, StudentFee.id == FeePayment.student_fee_id, isouter=True
    ).where(StudentFee.student_id == student_profile.id)
    
    results = session.exec(student_fees_query).all()
    
    fees = []
    for student_fee, fee, payment in results:
        # Determine fee status (renamed to avoid conflict with imported status)
        fee_status = student_fee.status
        if fee_status == FeeStatusEnum.pending and fee.deadline < date.today():
            fee_status = FeeStatusEnum.overdue
        
        # Build installment options
        installment_options = None
        if fee.is_installment_available and fee.installment_count:
            installment_options = {
                "count": fee.installment_count,
                "amount": fee.installment_amount or (fee.amount / fee.installment_count)
            }
        
        fee_response = FeeResponse(
            id=student_fee.id,
            title=fee.title,
            description=fee.description,
            amount=student_fee.amount_due,
            deadline=fee.deadline,
            status=fee_status,
            transaction_id=payment.transaction_id if payment else None,
            payment_date=payment.payment_date if payment else None,
            category=fee.type.value,
            semester=fee.semester,
            academic_year=fee.academic_year,
            installment_options=installment_options
        )
        fees.append(fee_response)
    
    return fees

@router.post("/payments/create-intent")
async def create_payment_intent(
    intent_data: PaymentIntentCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user_or_mock)
):
    """Create a Stripe payment intent"""
    if current_user.role != "student":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only students can create payment intents"
        )
    
    # Verify student fee exists and belongs to current user
    student_fee = session.exec(
        select(StudentFee).where(StudentFee.id == intent_data.student_fee_id)
    ).first()
    
    if not student_fee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student fee not found"
        )
    
    # Get student profile to verify ownership
    student_profile = session.exec(
        select(StudentProfile).where(StudentProfile.user_id == current_user.id)
    ).first()
    
    if not student_profile or student_fee.student_id != student_profile.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied to this fee"
        )
    
    try:
        # Create Stripe payment intent
        intent = stripe.PaymentIntent.create(
            amount=int(intent_data.amount * 100),  # Convert to cents
            currency=intent_data.currency,
            metadata={
                "student_fee_id": intent_data.student_fee_id,
                "user_id": current_user.id,
                "student_name": current_user.name
            }
        )
        
        # Save payment intent record
        payment_intent = StripePaymentIntent(
            id=str(uuid.uuid4()),
            stripe_payment_intent_id=intent.id,
            student_fee_id=intent_data.student_fee_id,
            user_id=current_user.id,
            amount=intent_data.amount,
            currency=intent_data.currency,
            status=intent.status,
            client_secret=intent.client_secret
        )
        
        session.add(payment_intent)
        session.commit()
        
        return {
            "client_secret": intent.client_secret,
            "payment_intent_id": intent.id
        }
        
    except stripe.error.StripeError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Stripe error: {str(e)}"
        )

@router.post("/payments/confirm")
async def confirm_payment(
    payment_data: PaymentConfirm,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user_or_mock)
):
    """Confirm a payment and update fee status"""
    if current_user.role != "student":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only students can confirm payments"
        )
    
    # Get payment intent record
    payment_intent = session.exec(
        select(StripePaymentIntent).where(
            StripePaymentIntent.stripe_payment_intent_id == payment_data.payment_intent_id
        )
    ).first()
    
    if not payment_intent:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payment intent not found"
        )
    
    if payment_intent.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied to this payment"
        )
    
    try:
        # Verify payment with Stripe
        stripe_intent = stripe.PaymentIntent.retrieve(payment_data.payment_intent_id)
        
        if stripe_intent.status == "succeeded":
            # Update student fee status
            student_fee = session.exec(
                select(StudentFee).where(StudentFee.id == payment_intent.student_fee_id)
            ).first()
            
            if student_fee:
                student_fee.status = FeeStatusEnum.paid
                student_fee.amount_paid = payment_intent.amount
                student_fee.updated_at = datetime.now()
                
                # Create payment record
                payment = FeePayment(
                    id=str(uuid.uuid4()),
                    student_fee_id=payment_intent.student_fee_id,
                    user_id=current_user.id,
                    amount_paid=payment_intent.amount,
                    payment_method=PaymentMethodEnum.stripe,
                    stripe_payment_intent_id=payment_data.payment_intent_id,
                    stripe_payment_method_id=payment_data.payment_method_id,
                    stripe_transaction_id=stripe_intent.id,
                    transaction_id=stripe_intent.id,
                    status=FeeStatusEnum.paid
                )
                
                session.add(payment)
                
                # Update payment intent record
                payment_intent.status = stripe_intent.status
                payment_intent.updated_at = datetime.now()
                
                session.commit()
                
                return {
                    "success": True,
                    "payment_id": payment.id,
                    "transaction_id": stripe_intent.id
                }
        
        return {
            "success": False,
            "message": "Payment not successful",
            "status": stripe_intent.status
        }
        
    except stripe.error.StripeError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Stripe error: {str(e)}"
        )

@router.get("/payments/history")
async def get_payment_history(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user_or_mock)
):
    """Get payment history for current student"""
    if current_user.role != "student":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only students can access payment history"
        )
    
    # Get student profile
    student_profile = session.exec(
        select(StudentProfile).where(StudentProfile.user_id == current_user.id)
    ).first()
    
    if not student_profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student profile not found"
        )
    
    # Get payment history
    payments = session.exec(
        select(FeePayment, StudentFee, Fee).join(
            StudentFee, FeePayment.student_fee_id == StudentFee.id
        ).join(
            Fee, StudentFee.fee_id == Fee.id
        ).where(
            StudentFee.student_id == student_profile.id,
            FeePayment.status == FeeStatusEnum.paid
        ).order_by(FeePayment.payment_date.desc())
    ).all()
    
    payment_history = []
    for payment, student_fee, fee in payments:
        payment_history.append({
            "id": payment.id,
            "fee_title": fee.title,
            "amount_paid": payment.amount_paid,
            "payment_date": payment.payment_date,
            "payment_method": payment.payment_method,
            "transaction_id": payment.transaction_id,
            "status": payment.status
        })
    
    return payment_history

# Admin endpoints
@router.post("/admin/fees", response_model=Fee)
async def create_fee(
    fee_data: FeeCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user_or_mock)
):
    """Create a new fee (admin only)"""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can create fees"
        )
    
    fee = Fee(
        id=str(uuid.uuid4()),
        **fee_data.dict()
    )
    
    session.add(fee)
    session.commit()
    session.refresh(fee)
    
    return fee

@router.get("/admin/fees", response_model=List[Fee])
async def get_all_fees(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user_or_mock)
):
    """Get all fees (admin only)"""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can view all fees"
        )
    
    fees = session.exec(select(Fee)).all()
    return fees

@router.put("/admin/fees/{fee_id}", response_model=Fee)
async def update_fee(
    fee_id: str,
    fee_data: FeeUpdate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user_or_mock)
):
    """Update a fee (admin only)"""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can update fees"
        )
    
    fee = session.exec(select(Fee).where(Fee.id == fee_id)).first()
    if not fee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Fee not found"
        )
    
    for field, value in fee_data.dict(exclude_unset=True).items():
        setattr(fee, field, value)
    
    fee.updated_at = datetime.now()
    session.commit()
    session.refresh(fee)
    
    return fee

@router.delete("/admin/fees/{fee_id}")
async def delete_fee(
    fee_id: str,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user_or_mock)
):
    """Delete a fee (admin only)"""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can delete fees"
        )
    
    fee = session.exec(select(Fee).where(Fee.id == fee_id)).first()
    if not fee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Fee not found"
        )
    
    session.delete(fee)
    session.commit()
    
    return {"message": "Fee deleted successfully"}

@router.post("/admin/assign-fee/{fee_id}/student/{student_id}")
async def assign_fee_to_student(
    fee_id: str,
    student_id: str,
    amount_due: Optional[float] = None,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user_or_mock)
):
    """Assign a fee to a student (admin only)"""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can assign fees"
        )
    
    # Check if fee exists
    fee = session.exec(select(Fee).where(Fee.id == fee_id)).first()
    if not fee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Fee not found"
        )
    
    # Check if student exists
    student = session.exec(select(StudentProfile).where(StudentProfile.id == student_id)).first()
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found"
        )
    
    # Check if already assigned
    existing = session.exec(
        select(StudentFee).where(
            StudentFee.student_id == student_id,
            StudentFee.fee_id == fee_id
        )
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Fee already assigned to this student"
        )
    
    # Create student fee
    student_fee = StudentFee(
        id=str(uuid.uuid4()),
        student_id=student_id,
        fee_id=fee_id,
        amount_due=amount_due or fee.amount
    )
    
    session.add(student_fee)
    session.commit()
    session.refresh(student_fee)
    
    return student_fee 