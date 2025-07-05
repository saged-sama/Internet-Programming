from datetime import date
from enum import Enum
from typing import Optional

from sqlmodel import Field, SQLModel

class FeeTypeEnum(str, Enum):
    tuition_fee = "tuition_fee"
    other = "other"

class FeeStatusEnum(str, Enum):
    pending = "pending"
    paid = "paid"
    waived = "waived"
    
class Fee(SQLModel, table=True):
    id: str = Field(primary_key=True)
    title: Optional[str]
    type: Optional[FeeTypeEnum]
    amount: Optional[float]
    deadline: Optional[date]

class FeePayment(SQLModel, table=True):
    id: str = Field(primary_key=True)
    fee_id: Optional[str] = Field(foreign_key="fee.id")
    user_id: Optional[str] = Field(foreign_key="user.id")
    amount_paid: Optional[float]
    payment_date: Optional[date]
    status: Optional[FeeStatusEnum]