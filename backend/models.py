from pydantic import BaseModel, Field
from datetime import date as date_type, datetime
from decimal import Decimal
from typing import Optional

class ExpenseBase(BaseModel):
    amount: Decimal = Field(..., gt=0, description="Expense amount (must be positive)")
    category: str = Field(..., min_length=1, description="Expense category")
    description: str = Field(..., min_length=1, description="Expense description")
    date: date_type = Field(..., description="Expense date")

class ExpenseCreate(ExpenseBase):
    pass

class Expense(ExpenseBase):
    id: str
    created_at: datetime
    
    class Config:
        from_attributes = True

