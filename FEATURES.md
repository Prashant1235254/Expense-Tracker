# Advanced Expense Tracker Features

This document outlines the four new AI-powered features implemented in the Expense Tracker.

---

## 1. 🤖 AI Categorization (NLP)

**What it does:** Automatically sorts expenses into predefined categories using keyword matching.

**How it works:**
- When you add an expense, the backend analyzes the title and auto-assigns a category
- Keywords are matched against predefined lists (Food, Transport, Entertainment, etc.)
- Users can override the auto-category if desired

**Categories supported:**
- Food (restaurant, cafe, pizza, burger, grocery, etc.)
- Transport (gas, taxi, uber, bus, fuel, parking, etc.)
- Entertainment (movie, cinema, game, concert, streaming, etc.)
- Utilities (electric, water, internet, phone, bill, etc.)
- Shopping (mall, shop, amazon, clothing, etc.)
- Health (doctor, hospital, medicine, pharmacy, gym, etc.)

**Example:**
```
Input: "Pizza Hut Dinner" → Auto-categorized as "Food"
Input: "Uber Ride" → Auto-categorized as "Transport"
```

**Backend endpoint:** `POST /add-expense`
- Response includes `"category": "Food"` (auto-detected)

---

## 2. 📈 Predictive Alerts (Forecasting)

**What it does:** Forecasts your month-end spending and warns about potential overspending.

**How it works:**
- Calculates your daily spending rate based on expenses so far
- Extrapolates to end-of-month using remaining days
- Compares against your average monthly spending
- Flags overspending if projected total > avg by 20%

**Alert triggers:**
- ⚠️ **High severity**: When projected month-end spending exceeds historical average by 20%
- Shows: Current total, projected total, daily rate, days remaining

**Example:**
```
Current spending (15th May): ₹3,000
Daily rate: ₹200/day
Days remaining: 16
Projected total: ₹6,200

If average monthly spend: ₹5,000
→ Alert: "Warning: Projected to spend ₹6,200 (avg: ₹5,000)"
```

**Backend endpoint:** `GET /alerts/{email}`
- Response includes predictive forecast data

---

## 3. 🔍 Anomaly Detection

**What it does:** Identifies unusual transactions and detects subscription/spending hikes.

**How it works:**
1. **High-value transactions**: Flags expenses > 2 standard deviations above average
2. **Subscription hikes**: Detects category spending increases > 25% month-over-month

**Alert types:**
- 🔴 **Subscription Hike** (High severity): Category spending increased by 25%+
- 🟡 **High Transaction** (Medium severity): Unusual single expense detected

**Example:**
```
May Food spending: ₹2,000
June Food spending: ₹2,600
Increase: 30% → Alert: "Food spending increased by 30%"

Single expense: ₹5,000 (avg: ₹1,000, std: ₹800)
→ Alert: "Unusually high expense detected"
```

**Backend endpoint:** `GET /alerts/{email}`
- Returns anomaly details with severity levels

---

## 4. 📊 Visual Analytics Dashboard

**What it does:** Real-time spending heatmaps, category breakdowns, and analytics.

**Dashboard components:**

### a) **Summary Cards**
- Current month total (₹)
- Top spending category
- Number of expense categories

### b) **Dynamic Spending Heatmap**
- Color-coded by category
- Opacity represents spending intensity (darker = more spent)
- Shows percentage of total for each category
- Auto-assigns colors per category

### c) **Expense List**
- Color-coded cards matching heatmap
- Shows date, amount, category
- Easy delete button

### d) **Monthly History**
- Tracks last 6 months of spending trends
- Powers the predictive alert calculations

**Colors assigned:**
- 🟠 Food: Orange
- 🔵 Transport: Blue
- 🟣 Entertainment: Purple
- 🔴 Utilities: Red
- 🩷 Shopping: Pink
- 🟢 Health: Green

**Frontend endpoint:** `GET /analytics/{email}`
- Returns: current_total, category_breakdown, monthly_history

---

## 📱 How to Use

### 1. Add Expense with Auto-Categorization
```
Go to "Add Expense"
Title: "Pizza Hut Dinner" (category auto-detected as "Food")
Amount: ₹500
Click "Add Expense"
```

### 2. View Analytics Dashboard
```
Go to "View Expense" (Dashboard)
See:
  - ⚠️ Alerts section (predictive + anomalies)
  - 📊 Spending heatmap by category
  - 💰 Summary cards
  - 📋 Expense list
```

### 3. Monitor Alerts
- Red alerts = high severity (overspending forecast)
- Yellow alerts = medium severity (unusual transactions)

---

## 🔧 Technical Details

### Backend Changes

**New Models:**
- `Expense`: Added `email` (user email) and `created_at` (timestamp)
- `Alert`: Stores alert history (type, severity, message)

**New Endpoints:**
- `GET /analytics/{email}` - Category breakdown + monthly history
- `GET /alerts/{email}` - Predictive alerts + anomalies
- `GET /expenses?email={email}` - User-specific expenses

**New Functions:**
- `auto_categorize(title)` - Keyword-based categorization
- `calculate_spending_stats(email)` - Spending analytics
- `detect_anomalies(email)` - Anomaly & subscription hike detection
- `forecast_month_end(email)` - Predictive forecasting

### Frontend Changes

**Updated Pages:**
- `add-expense/page.tsx` - Auto-categorization display
- `view-expense/page.tsx` - Full analytics dashboard

**New Data Types:**
- Analytics interface
- Alert interface
- Enhanced Expense type with timestamps

---

## 🚀 Setup Instructions

### 1. Update Backend Database
```bash
cd backend
# The models.py changes will auto-create new tables
python -c "import models"  # Runs metadata.create_all()
```

### 2. Run Backend
```bash
cd backend
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

### 3. Run Frontend
```bash
cd frontend
npm run dev
```

### 4. Test Flow
```
1. Register an account
2. Login
3. Add expenses with different titles (e.g., "Pizza", "Uber", "Movie ticket")
4. Go to Dashboard to see:
   - Auto-categorized expenses
   - Alerts (if spending patterns match)
   - Heatmap visualization
```

---

## 📈 Future Enhancements

1. **ML-based categorization** - Replace keyword matching with trained classifier
2. **Custom categories** - Users create their own category rules
3. **Expense forecasting** - ML models predict next month's spending
4. **Budget alerts** - Set custom budget limits per category
5. **Export reports** - PDF/CSV generation
6. **Multi-currency support** - Convert expenses to common currency
7. **Recurring expense tracking** - Auto-flag recurring charges
8. **Social comparison** - Compare spending with anonymized peers

---

## 📝 Database Schema

### Expense Table
```sql
CREATE TABLE expenses (
    id INTEGER PRIMARY KEY,
    title VARCHAR,
    amount FLOAT,
    category VARCHAR,
    email VARCHAR,
    created_at DATETIME DEFAULT NOW()
);
```

### Alert Table
```sql
CREATE TABLE alerts (
    id INTEGER PRIMARY KEY,
    email VARCHAR,
    alert_type VARCHAR,
    message VARCHAR,
    threshold FLOAT,
    current_value FLOAT,
    created_at DATETIME DEFAULT NOW()
);
```

---

## 🐛 Troubleshooting

**Q: Categories not auto-detecting?**
- A: Make sure expense title contains keywords from CATEGORY_KEYWORDS in backend/main.py

**Q: No alerts showing?**
- A: Need at least 2 expenses for anomaly detection. Add more expenses.

**Q: Backend errors?**
- A: Ensure PostgreSQL is running and database connection is valid

**Q: Frontend not showing analytics?**
- A: Check browser console for CORS errors. Backend should allow all origins.

---

## 📞 Support

For issues or feature requests, please check the README.md in the project root.
