// Seed data for the Hartono Household Budget — November 2026.
// Every figure on the site is computed from these lists, so the dashboard,
// budgets and reports can never disagree with the transactions.
window.HARTONO_SEED = {
  household: "Hartono Household",
  month: "November 2026",
  monthShort: "Nov 2026",

  transactions: [
    { id: "t01", date: "2026-11-01", description: "Salary — Hartono Design Studio", category: "Salary", type: "income", amount: 4200.00 },
    { id: "t02", date: "2026-11-01", description: "Monthly rent", category: "Housing", type: "expense", amount: 1450.00 },
    { id: "t03", date: "2026-11-02", description: "Monthly bus pass", category: "Transport", type: "expense", amount: 65.00 },
    { id: "t04", date: "2026-11-03", description: "Weekly groceries — FreshMart", category: "Groceries", type: "expense", amount: 186.40 },
    { id: "t05", date: "2026-11-05", description: "Electric bill — City Power", category: "Utilities", type: "expense", amount: 96.50 },
    { id: "t06", date: "2026-11-06", description: "Internet — FiberNet", category: "Utilities", type: "expense", amount: 59.99 },
    { id: "t07", date: "2026-11-07", description: "Fuel — Shell Station", category: "Transport", type: "expense", amount: 48.00 },
    { id: "t08", date: "2026-11-08", description: "Family dinner — Sari Rasa", category: "Dining", type: "expense", amount: 68.25 },
    { id: "t09", date: "2026-11-09", description: "Streaming — MovieStream", category: "Entertainment", type: "expense", amount: 15.99 },
    { id: "t10", date: "2026-11-10", description: "Weekly groceries — FreshMart", category: "Groceries", type: "expense", amount: 214.75 },
    { id: "t11", date: "2026-11-12", description: "Freelance — logo project", category: "Salary", type: "income", amount: 450.00 },
    { id: "t12", date: "2026-11-12", description: "Water bill — City Water", category: "Utilities", type: "expense", amount: 42.30 },
    { id: "t13", date: "2026-11-14", description: "Movie night — Cinema XXI", category: "Entertainment", type: "expense", amount: 42.00 },
    { id: "t14", date: "2026-11-15", description: "Takeout — Burger House", category: "Dining", type: "expense", amount: 34.50 },
    { id: "t15", date: "2026-11-17", description: "Weekly groceries — FreshMart", category: "Groceries", type: "expense", amount: 158.20 },
    { id: "t16", date: "2026-11-18", description: "Tax refund", category: "Salary", type: "income", amount: 200.00 },
    { id: "t17", date: "2026-11-19", description: "Pharmacy — Meds", category: "Health", type: "expense", amount: 28.75 },
    { id: "t18", date: "2026-11-20", description: "Fuel — Shell Station", category: "Transport", type: "expense", amount: 52.40 },
    { id: "t19", date: "2026-11-24", description: "Weekly groceries — FreshMart", category: "Groceries", type: "expense", amount: 142.90 }
  ],

  budgets: [
    { category: "Housing", limit: 1500 },
    { category: "Groceries", limit: 750 },
    { category: "Transport", limit: 200 },
    { category: "Utilities", limit: 220 },
    { category: "Dining", limit: 150 },
    { category: "Entertainment", limit: 80 },
    { category: "Health", limit: 100 }
  ],

  goals: [
    { id: "g1", name: "Emergency Fund", target: 5000, saved: 3850, note: "Six months of essentials, for peace of mind." },
    { id: "g2", name: "Bali Family Vacation", target: 1800, saved: 1120, note: "Flights and a beach stay in March." },
    { id: "g3", name: "New Laptop", target: 1200, saved: 640, note: "Replacing the 2019 laptop before it dies." }
  ],

  bills: [
    { id: "b1", name: "Rent", amount: 1450.00, due: "2026-11-01", paid: true },
    { id: "b2", name: "Internet — FiberNet", amount: 59.99, due: "2026-11-06", paid: true },
    { id: "b3", name: "Streaming — MovieStream", amount: 15.99, due: "2026-11-09", paid: true },
    { id: "b4", name: "Electric — City Power", amount: 96.50, due: "2026-11-15", paid: true },
    { id: "b5", name: "Water — City Water", amount: 42.30, due: "2026-11-20", paid: true },
    { id: "b6", name: "Phone — Mobile plan", amount: 45.00, due: "2026-11-25", paid: true },
    { id: "b7", name: "Gym membership", amount: 35.00, due: "2026-11-28", paid: false }
  ],

  // Past months, for the Reports trend chart (income and spending per month).
  monthlyTrend: [
    { month: "Jun", income: 4800, expenses: 2410 },
    { month: "Jul", income: 4850, expenses: 2580 },
    { month: "Aug", income: 4800, expenses: 2495 },
    { month: "Sep", income: 4900, expenses: 2660 },
    { month: "Oct", income: 4850, expenses: 2730 },
    { month: "Nov", income: 4850, expenses: 2705.93 }
  ]
};
