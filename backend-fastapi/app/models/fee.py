from datetime import date, datetime
from enum import Enum
from typing import Optional

from sqlmodel import Field, SQLModel

class FeeTypeEnum(str, Enum):
    tuition_fee = "tuition_fee"
    development = "development"
    admission = "admission"
    other = "other"

class FeeStatusEnum(str, Enum):
    pending = "pending"
    paid = "paid"
    waived = "waived"
    overdue = "overdue"

class PaymentMethodEnum(str, Enum):
    stripe = "stripe"
    bank_transfer = "bank_transfer"
    cash = "cash"
    
class Fee(SQLModel, table=True):
    id: str = Field(primary_key=True)
    title: str
    description: Optional[str] = None
    type: FeeTypeEnum = Field(default=FeeTypeEnum.other)
    amount: float
    deadline: date
    semester: Optional[str] = None
    academic_year: Optional[str] = None
    is_installment_available: bool = Field(default=False)
    installment_count: Optional[int] = None
    installment_amount: Optional[float] = None
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

class StudentFee(SQLModel, table=True):
    """Junction table for student-specific fees"""
    id: str = Field(primary_key=True)
    student_id: str = Field(foreign_key="studentprofile.id")
    fee_id: str = Field(foreign_key="fee.id")
    status: FeeStatusEnum = Field(default=FeeStatusEnum.pending)
    amount_due: float  # Can be different from base fee amount
    amount_paid: float = Field(default=0.0)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

class FeePayment(SQLModel, table=True):
    id: str = Field(primary_key=True)
    student_fee_id: str = Field(foreign_key="studentfee.id")
    user_id: str = Field(foreign_key="user.id")
    amount_paid: float
    payment_method: PaymentMethodEnum
    payment_date: datetime = Field(default_factory=datetime.now)
    status: FeeStatusEnum = Field(default=FeeStatusEnum.paid)
    
    # Stripe-specific fields
    stripe_payment_intent_id: Optional[str] = None
    stripe_payment_method_id: Optional[str] = None
    stripe_transaction_id: Optional[str] = None
    
    # General transaction fields
    transaction_id: Optional[str] = None
    payment_reference: Optional[str] = None
    notes: Optional[str] = None
    
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

class StripePaymentIntent(SQLModel, table=True):
    """Track Stripe payment intents"""
    id: str = Field(primary_key=True)
    stripe_payment_intent_id: str
    student_fee_id: str = Field(foreign_key="studentfee.id")
    user_id: str = Field(foreign_key="user.id")
    amount: float
    currency: str = Field(default="usd")
    status: str  # Stripe payment intent status
    client_secret: str
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)