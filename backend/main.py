from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from database import SessionLocal
from models import Expense, Alert
import models
from datetime import datetime, timedelta
from collections import defaultdict
import statistics

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ExpenseCreate(BaseModel):
    title: str
    amount: float
    category: str
    email: str

class AlertData(BaseModel):
    email: str

# NLP Categorization Keywords
CATEGORY_KEYWORDS = {
    "Food": ["restaurant", "cafe", "pizza", "burger", "food", "grocery", "market", "lunch", "dinner", "breakfast"],
    "Transport": ["gas", "taxi", "uber", "bus", "train", "fuel", "parking", "car", "bike"],
    "Entertainment": ["movie", "cinema", "game", "concert", "show", "ticket", "streaming"],
    "Utilities": ["electric", "water", "internet", "phone", "bill", "utility"],
    "Shopping": ["mall", "shop", "store", "amazon", "clothing", "dress"],
    "Health": ["doctor", "hospital", "medicine", "pharmacy", "health", "gym"],
}

def auto_categorize(title: str) -> str:
    """Auto-categorize expense using keyword matching (NLP-lite)"""
    title_lower = title.lower()
    for category, keywords in CATEGORY_KEYWORDS.items():
        if any(keyword in title_lower for keyword in keywords):
            return category
    return "Other"

def calculate_spending_stats(email: str, db):
    """Calculate spending statistics for alerts and analytics"""
    expenses = db.query(Expense).filter(Expense.email == email).all()
    if not expenses:
        return None
    
    current_month = datetime.utcnow().month
    current_year = datetime.utcnow().year
    
    # Current month expenses
    current_month_expenses = [
        e for e in expenses 
        if e.created_at.month == current_month and e.created_at.year == current_year
    ]
    current_total = sum(e.amount for e in current_month_expenses)
    
    # Category breakdown
    category_totals = defaultdict(float)
    for expense in current_month_expenses:
        category_totals[expense.category] += expense.amount
    
    # Historical trend (last 6 months)
    monthly_totals = defaultdict(float)
    for expense in expenses:
        month_key = f"{expense.created_at.year}-{expense.created_at.month:02d}"
        monthly_totals[month_key] += expense.amount
    
    return {
        "expenses": expenses,
        "current_total": current_total,
        "category_totals": dict(category_totals),
        "monthly_totals": dict(monthly_totals),
        "current_month_expenses": current_month_expenses,
    }

def detect_anomalies(email: str, db):
    """Detect unusual transactions and subscription hikes"""
    stats = calculate_spending_stats(email, db)
    if not stats:
        return []
    
    anomalies = []
    expenses = stats["expenses"]
    current_month_expenses = stats["current_month_expenses"]
    
    # 1. Detect unusually high individual expenses
    if current_month_expenses:
        amounts = [e.amount for e in current_month_expenses]
        if len(amounts) > 2:
            mean_amount = statistics.mean(amounts)
            std_dev = statistics.stdev(amounts)
            for expense in current_month_expenses:
                if expense.amount > mean_amount + 2 * std_dev:
                    anomalies.append({
                        "type": "high_transaction",
                        "message": f"Unusually high expense: {expense.title} (₹{expense.amount:.2f})",
                        "expense_id": expense.id,
                        "severity": "medium"
                    })
    
    # 2. Detect recurring subscription hikes
    category_history = defaultdict(list)
    for expense in expenses:
        month_key = f"{expense.created_at.year}-{expense.created_at.month:02d}"
        category_history[expense.category].append((month_key, expense.amount))
    
    for category, amounts_by_month in category_history.items():
        if len(amounts_by_month) >= 2:
            amounts_by_month.sort()
            latest_month, latest_amount = amounts_by_month[-1]
            prev_month, prev_amount = amounts_by_month[-2]
            increase_pct = ((latest_amount - prev_amount) / prev_amount * 100) if prev_amount > 0 else 0
            if increase_pct > 25:
                anomalies.append({
                    "type": "subscription_hike",
                    "message": f"{category} spending increased by {increase_pct:.1f}%",
                    "category": category,
                    "increase_pct": increase_pct,
                    "severity": "high"
                })
    
    return anomalies

def forecast_month_end(email: str, db):
    """Forecast end-of-month balance and flag overspending"""
    stats = calculate_spending_stats(email, db)
    if not stats:
        return None
    
    current_total = stats["current_total"]
    monthly_totals = stats["monthly_totals"]
    
    # Average monthly spend (last 3 months)
    if len(monthly_totals) >= 3:
        recent_months = sorted(monthly_totals.values())[-3:]
        avg_monthly = statistics.mean(recent_months)
    else:
        avg_monthly = current_total if current_total > 0 else 1000
    
    # Days remaining in month
    today = datetime.utcnow()
    last_day = (today.replace(day=1) + timedelta(days=32)).replace(day=1) - timedelta(days=1)
    days_remaining = (last_day.day - today.day) + 1
    
    # Extrapolate
    daily_rate = current_total / max(today.day, 1)
    projected_total = current_total + (daily_rate * days_remaining)
    
    # Overspending flag (if projected > avg by 20%)
    overspending = projected_total > avg_monthly * 1.2
    
    return {
        "current_total": current_total,
        "projected_total": round(projected_total, 2),
        "average_monthly": round(avg_monthly, 2),
        "overspending": overspending,
        "days_remaining": days_remaining,
        "daily_rate": round(daily_rate, 2),
    }

@app.get("/")
def home():
    return {"message": "Backend Running Successfully"}

@app.post("/add-expense")
def add_expense(expense: ExpenseCreate):
    db = SessionLocal()

    # Auto-categorize if not provided
    auto_category = auto_categorize(expense.title)
    
    # Check for duplicates
    existing_expense = db.query(Expense).filter(
        Expense.title == expense.title,
        Expense.email == expense.email
    ).first()
    
    if existing_expense:
        existing_expense.amount = expense.amount
        existing_expense.category = expense.category or auto_category
        existing_expense.created_at = datetime.utcnow()
        db.commit()
        db.refresh(existing_expense)
        return {
            "message": "Expense updated successfully",
            "category": existing_expense.category
        }

    new_expense = Expense(
        title=expense.title,
        amount=expense.amount,
        category=expense.category or auto_category,
        email=expense.email,
        created_at=datetime.utcnow()
    )

    db.add(new_expense)
    db.commit()
    db.refresh(new_expense)

    return {
        "message": "Expense added successfully",
        "category": new_expense.category,
        "id": new_expense.id
    }

@app.get("/expenses")
def get_expenses(email: str = None):
    db = SessionLocal()
    if email:
        expenses = db.query(Expense).filter(Expense.email == email).all()
    else:
        expenses = db.query(Expense).all()
    return expenses

@app.get("/analytics/{email}")
def get_analytics(email: str):
    """Return spending analytics and category breakdown"""
    db = SessionLocal()
    stats = calculate_spending_stats(email, db)
    if not stats:
        return {"message": "No expenses found"}
    
    return {
        "current_total": stats["current_total"],
        "category_breakdown": stats["category_totals"],
        "monthly_history": stats["monthly_totals"],
        "expense_count": len(stats["current_month_expenses"]),
    }

@app.get("/alerts/{email}")
def get_alerts(email: str):
    """Get all alerts for a user"""
    db = SessionLocal()
    
    forecast = forecast_month_end(email, db)
    anomalies = detect_anomalies(email, db)
    
    alerts = []
    
    # Add predictive alert
    if forecast:
        if forecast["overspending"]:
            alerts.append({
                "type": "predictive",
                "severity": "high",
                "message": f"Warning: Projected to spend ₹{forecast['projected_total']:.2f} this month (avg: ₹{forecast['average_monthly']:.2f})",
                "data": forecast
            })
    
    # Add anomaly alerts
    for anomaly in anomalies:
        alerts.append({
            "type": "anomaly",
            "severity": anomaly.get("severity", "low"),
            "message": anomaly["message"],
            "data": anomaly
        })
    
    return {"alerts": alerts, "count": len(alerts)}

@app.delete("/delete-expense/{expense_id}")
def delete_expense(expense_id: int):
    db = SessionLocal()
    expense = db.query(Expense).filter(Expense.id == expense_id).first()
    if not expense:
        return {"message": "Expense not found"}

    db.delete(expense)
    db.commit()
    return {"message": "Expense deleted successfully"}