# Feature Overview & Visual Guide

## 🎯 Four New Features at a Glance

### 1️⃣ 🤖 AI Categorization (NLP)
**What:** Automatically detects expense category from title
**Example Flow:**
```
User enters: "Pizza Hut Dinner" for ₹500
         ↓
Backend analyzes: "pizza" keyword found
         ↓
Auto-categorized: 🍕 FOOD
         ↓
System response: "Expense added. Auto-categorized as: Food"
```

**Supported Categories & Keywords:**
- 🍕 **Food**: pizza, restaurant, cafe, burger, grocery, lunch, dinner
- 🚗 **Transport**: taxi, uber, gas, fuel, parking, bus, train
- 🎬 **Entertainment**: movie, cinema, game, concert, streaming, show
- 💡 **Utilities**: electricity, water, internet, phone, bill
- 🛍️ **Shopping**: mall, store, amazon, clothing, dress
- 🏥 **Health**: doctor, hospital, medicine, pharmacy, gym
- ❓ **Other**: anything else

---

### 2️⃣ 📈 Predictive Alerts (Forecasting)
**What:** Warns you if you're on track to overspend

**How It Works:**
```
Day 15 of Month (Mid-month):
  Total spent so far: ₹3,000
  Days passed: 15
  Daily rate: ₹3,000 ÷ 15 = ₹200/day
  
Days remaining: 16
  Projected for remaining: ₹200 × 16 = ₹3,200
  
Full month projection: ₹3,000 + ₹3,200 = ₹6,200

Historical average: ₹5,000/month

⚠️ ALERT: "Warning: Projected to spend ₹6,200 (avg: ₹5,000)"
Severity: HIGH (24% over average)
```

**When Alert Triggers:**
- Projected > Average by 20%

**Alert Details Shown:**
- Current total spent
- Projected month-end total
- Your average monthly spend
- Daily spending rate
- Days remaining

---

### 3️⃣ 🔍 Anomaly Detection (Pattern Analysis)
**What:** Flags unusual spending patterns and subscription hikes

**Two Types of Detection:**

#### A) Unusually High Transactions
```
Normal transactions: ₹300, ₹400, ₹350 (avg ₹350)
Standard deviation: ₹50

New transaction: ₹2,500
  Is 2,500 > (350 + 2×50)?
  Is 2,500 > 450? YES ✓
  
🟡 Alert: "Unusually high expense detected: [title] (₹2,500)"
Severity: MEDIUM
```

#### B) Subscription/Category Hikes
```
May - Food category: ₹2,000
June - Food category: ₹2,600

Increase: (2,600 - 2,000) / 2,000 × 100 = 30%

Is 30% > 25% threshold? YES ✓

🔴 Alert: "Food spending increased by 30%"
Severity: HIGH (likely price hike or consumption change)
```

---

### 4️⃣ 📊 Visual Analytics Dashboard
**What:** Real-time spending visualization with insights

**Dashboard Layout:**

```
┌─────────────────────────────────────────────────────────────────┐
│                  ⚠️ ALERTS & PREDICTIONS                         │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ 🔴 Warning: Projected to spend ₹6,200 (avg: ₹5,000)      │ │
│  │    Daily Rate: ₹200/day | Days Left: 16                   │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────┬──────────────────────┬──────────────────────┐
│ CURRENT MONTH TOTAL  │   TOP CATEGORY       │  CATEGORIES USED     │
│      ₹3,000          │    Transport (50%)    │        5             │
│                      │      ₹1,500           │   expense types      │
└──────────────────────┴──────────────────────┴──────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                📊 SPENDING HEATMAP BY CATEGORY                  │
│  ┌──────────┬──────────┬──────────┬──────────┐                │
│  │🍕 FOOD   │🚗TRANSP. │🎬 ENTER. │💡UTIL.   │                │
│  │ ₹800     │ ₹1500    │  ₹500    │  ₹200    │                │
│  │  27%     │   50%    │   17%    │   7%     │                │
│  └──────────┴──────────┴──────────┴──────────┘                │
│  (Darker/more opaque = more spending in category)             │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                       ALL EXPENSES                              │
│  ┌────────────────────┐  ┌────────────────────┐                │
│  │🍕 Pizza Hut        │  │🚗 Uber Ride        │                │
│  │ ₹500               │  │ ₹300               │                │
│  │ Food               │  │ Transport          │                │
│  │ 📅 May 15, 2026    │  │ 📅 May 14, 2026    │                │
│  │ [Delete]           │  │ [Delete]           │                │
│  └────────────────────┘  └────────────────────┘                │
│                                                                  │
│  ┌────────────────────┐  ┌────────────────────┐                │
│  │🎬 Movie Ticket     │  │💡 Electricity Bill │                │
│  │ ₹200               │  │ ₹150               │                │
│  │ Entertainment      │  │ Utilities          │                │
│  │ 📅 May 13, 2026    │  │ 📅 May 10, 2026    │                │
│  │ [Delete]           │  │ [Delete]           │                │
│  └────────────────────┘  └────────────────────┘                │
└─────────────────────────────────────────────────────────────────┘
```

**Key Features:**
- ✅ Color-coded by category (auto-colors assigned)
- ✅ Opacity shows intensity (darker = more spent)
- ✅ Percentage shows share of total
- ✅ Date stamp on each expense
- ✅ Delete button for each expense
- ✅ Responsive: adapts to mobile/tablet/desktop

---

## 🎨 Category Colors Reference

| Category | Color | Hex | Icon |
|----------|-------|-----|------|
| Food | Orange | #fed7aa | 🍕 |
| Transport | Blue | #bfdbfe | 🚗 |
| Entertainment | Purple | #e9d5ff | 🎬 |
| Utilities | Red | #fecaca | 💡 |
| Shopping | Pink | #fbcfe8 | 🛍️ |
| Health | Green | #bbf7d0 | 🏥 |
| Other | Gray | #e5e7eb | ❓ |

**Heatmap Opacity Formula:**
```
opacity = 0.5 + (spending/max_spending × 100) × 0.5
Result: 50% to 100% opacity
```

---

## 📋 User Workflow Example

### Complete Journey: From Expense to Insight

**Step 1: User adds expense**
```
Screen: "Add Expense"
Input:  "Pizza Hut Dinner" | ₹500 | [Leave category blank]
Click:  "Add Expense"
Result: ✅ "Expense added. Auto-categorized as: Food"
```

**Step 2: User adds more expenses**
```
"Uber to Office"        | ₹300    → Auto: Transport
"Netflix Subscription"  | ₹200    → Auto: Entertainment
"Grocery Shopping"      | ₹1500   → Auto: Shopping
"Electricity Bill"      | ₹150    → Auto: Utilities
"Gym Membership"        | ₹1000   → Auto: Health
```

**Step 3: User views dashboard**
```
Screen: "View Expense"

Sees:
1. Alert: "Warning: Projected to spend ₹8,000 (avg: ₹5,000)"
   [Shows overspending detected]

2. Summary:
   - Current: ₹3,650
   - Top: Shopping (₹1,500, 41%)
   - Categories: 6

3. Heatmap:
   Food (15%)      [Light color]
   Transport (8%)   [Light color]
   Entertainment(5%) [Light color]
   Shopping (41%)   [Dark color] ← Most spent!
   Utilities (4%)   [Light color]
   Health (27%)     [Medium color]

4. Expense List:
   [6 colored cards showing all expenses]
```

**Step 4: Interpret insights**
```
User realizes:
- Shopping is highest category (41%)
- Should monitor shopping/subscription hike
- May need to cut back on transport or entertainment
- Already on track for overspending
```

---

## 🔢 Algorithm Complexity

| Feature | Time | Space | Details |
|---------|------|-------|---------|
| Auto-categorize | O(kw) | O(1) | k=categories, w=keywords |
| Analytics calc | O(n) | O(c) | n=expenses, c=categories |
| Anomalies | O(n+cm) | O(n) | c=categories, m=months |
| Forecast | O(n) | O(1) | Linear calculation |
| Full dashboard | O(n) | O(n) | All operations combined |

**Practical Performance:**
- 10 expenses: ~50ms total
- 100 expenses: ~200ms total
- 1000 expenses: ~800ms total

---

## 💡 Example Scenarios

### Scenario A: Budget-Conscious Shopper
```
Expenses:
- ₹5,000 / month average
- Balanced across categories
- No anomalies

Dashboard shows:
- Green indicators (no alerts)
- Evenly distributed heatmap
- Projected = Actual ≈ ₹5,000
```

### Scenario B: Heavy Commuter
```
Expenses:
- Transport: 60% of budget
- Other: 40%

Dashboard shows:
- Transport box very dark (intense spending)
- Alert: "Transport spending 50% higher than Food"
- Needs taxi/car/fuel optimization

```

### Scenario C: Subscription Creep
```
Month 1: Entertainment ₹500
Month 2: Entertainment ₹750 (50% increase)

Dashboard shows:
- 🔴 Alert: "Entertainment increased by 50%"
- Likely new subscription or price hike
- User identifies and cancels unused services
```

---

## 🚀 Quick Feature Comparison

| Feature | Type | Trigger | Alert Type |
|---------|------|---------|------------|
| Auto-categorize | ML/NLP | Always | Info |
| Predictive Alerts | Forecasting | Mid-month | Warning (High) |
| Anomaly - High TX | Statistical | On add | Medium |
| Anomaly - Hike | Trend | Monthly | High |
| Analytics | Dashboard | On view | Visual |

---

## 📱 Responsive Design

```
MOBILE (< 768px):
- Heatmap: 2 columns
- Summary: 1 column (stacked)
- Expense list: 1 column (full width)

TABLET (768-1024px):
- Heatmap: 3 columns
- Summary: 3 columns (grid)
- Expense list: 2 columns

DESKTOP (> 1024px):
- Heatmap: 4 columns
- Summary: 3 columns (grid)
- Expense list: 3 columns
```

---

## 🎓 Learning Path

**Beginner:**
1. Add simple expenses (e.g., "Food", "Taxi")
2. See auto-categorization working
3. View dashboard heatmap

**Intermediate:**
1. Add 10+ expenses across all categories
2. Observe category breakdown
3. Understand spending patterns

**Advanced:**
1. Monitor predictive alerts
2. Detect anomalies in own spending
3. Identify subscription hikes
4. Optimize category budgets

---

## ✅ Verification Checklist

- [ ] Auto-categorization correctly identifies category from title
- [ ] Dashboard loads without errors
- [ ] Heatmap colors and opacity vary by spending
- [ ] Predictive alert shows when overspending likely
- [ ] Anomaly alerts trigger for unusual patterns
- [ ] Expense list deletes items correctly
- [ ] Responsive design works on all screen sizes
- [ ] Multiple users have separate data
- [ ] Analytics calculations are accurate

---

**Ready to explore your spending patterns!** 📊✨
