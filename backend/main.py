from fastapi import FastAPI, HTTPException, Query, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime, date, timedelta
from decimal import Decimal
import uuid
from sqlalchemy.orm import Session
from database import get_db, init_db, ExpenseModel
from models import Expense, ExpenseCreate

app = FastAPI(title="Personal Expense Tracker API")

# CORS middleware to allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    init_db()

@app.get("/")
async def root():
    return {"message": "Personal Expense Tracker API"}

@app.post("/expenses", response_model=Expense)
async def create_expense(expense: ExpenseCreate, db: Session = Depends(get_db)):
    """
    Create a new expense entry.
    Handles idempotency by checking for duplicate entries based on
    amount, category, description, and date within a short time window.
    """
    try:
        # Check for potential duplicate (idempotency check)
        # Look for expenses with same amount, category, description, and date
        # created within the last 5 seconds (to handle retries)
        existing = db.query(ExpenseModel).filter(
            ExpenseModel.amount == expense.amount,
            ExpenseModel.category == expense.category,
            ExpenseModel.description == expense.description,
            ExpenseModel.date == expense.date,
            ExpenseModel.created_at >= datetime.utcnow() - timedelta(seconds=5)
        ).first()
        
        if existing:
            # Return existing expense if duplicate detected
            return Expense.model_validate(existing)
        
        # Create new expense
        db_expense = ExpenseModel(
            id=str(uuid.uuid4()),
            amount=expense.amount,
            category=expense.category,
            description=expense.description,
            date=expense.date,
            created_at=datetime.utcnow()
        )
        
        db.add(db_expense)
        db.commit()
        db.refresh(db_expense)
        
        return Expense.model_validate(db_expense)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error creating expense: {str(e)}")

@app.get("/expenses", response_model=List[Expense])
async def get_expenses(
    category: Optional[str] = Query(None, description="Filter by category"),
    sort: Optional[str] = Query(None, description="Sort order: 'date_desc' for newest first"),
    db: Session = Depends(get_db)
):
    """
    Get a list of expenses with optional filtering and sorting.
    """
    try:
        query = db.query(ExpenseModel)
        
        # Apply category filter if provided
        if category:
            query = query.filter(ExpenseModel.category == category)
        
        # Apply sorting
        if sort == "date_desc":
            query = query.order_by(ExpenseModel.date.desc(), ExpenseModel.created_at.desc())
        elif sort == "date_asc":
            query = query.order_by(ExpenseModel.date.asc(), ExpenseModel.created_at.asc())
        else:
            # Default: newest first by created_at
            query = query.order_by(ExpenseModel.created_at.desc())
        
        expenses = query.all()
        return [Expense.model_validate(exp) for exp in expenses]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching expenses: {str(e)}")

@app.get("/expenses/categories")
async def get_categories(db: Session = Depends(get_db)):
    """
    Get list of all unique categories for filtering.
    """
    try:
        categories = db.query(ExpenseModel.category).distinct().all()
        return {"categories": [cat[0] for cat in categories]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching categories: {str(e)}")

