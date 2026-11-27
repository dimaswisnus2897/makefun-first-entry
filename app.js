// Hartono Household Budget — all behaviour, no libraries, no network.
// State lives in localStorage; the seed in data.js is only used on first load.
const STORE_KEY = "hartono-budget-v1";
const CATEGORIES = ["Salary", "Housing", "Groceries", "Transport", "Utilities", "Dining", "Entertainment", "Health", "Other"];
const CHART_COLORS = ["#166534", "#16a34a", "#65a30d", "#ca8a04", "#0e7490", "#7c3aed", "#db2777"];

let state = loadState();
let txFilter = { q: "", category: "All", type: "all" };
let editingTxId = null;

function loadState() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.transactions)) return parsed;
    }
  } catch (e) { /* fall through to seed */ }
  return JSON.parse(JSON.stringify(window.HARTONO_SEED));
}

function saveState() {
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
}

function money(n) {
  return "$" + Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function totals() {
  let income = 0, expenses = 0;
  for (const t of state.transactions) {
    if (t.type === "income") income += t.amount; else expenses += t.amount;
  }
  return { income, expenses, balance: income - expenses, rate: income > 0 ? (income - expenses) / income * 100 : 0 };
}

function spentByCategory() {
  const spent = {};
  for (const t of state.transactions) {
    if (t.type !== "expense") continue;
    spent[t.category] = (spent[t.category] || 0) + t.amount;
  }
  return spent;
}

function fmtDate(iso) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function barClass(p) {
  if (p >= 95) return "bar over";
  if (p >= 80) return "bar warn";
  return "bar";
}

function progressBar(pct, label) {
  const p = Math.max(0, Math.min(100, pct));
  return '<div class="' + barClass(p) + '" role="progressbar" aria-valuenow="' + Math.round(p) + '" aria-label="' + esc(label) + '"><span style="width:' + p + '%"></span></div>';
}

// ---------- shared bits ----------

function txRow(t) {
  const sign = t.type === "income" ? "+" : "−";
  const cls = t.type === "income" ? "amt pos" : "amt neg";
  return '<li><div class="tx"><div><div class="desc">' + esc(t.description) + '</div>' +
    '<div class="meta">' + fmtDate(t.date) + ' · ' + esc(t.category) + '</div></div>' +
    '<span class="' + cls + '">' + sign + money(t.amount) + '</span></div></li>';
}

function categoryOptions(selected) {
  return CATEGORIES.map((c) => '<option value="' + c + '"' + (c === selected ? " selected" : "") + '>' + c + '</option>').join("");
}

// ---------- views ----------

function viewDashboard() {
  const t = totals();
  const spent = spentByCategory();
  const topBudgets = state.budgets.slice().sort((a, b) => (spent[b.category] || 0) / b.limit - (spent[a.category] || 0) / a.limit).slice(0, 3);
  const recent = [...state.transactions].sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id)).slice(0, 5);
  const upcoming = state.bills.filter((b) => !b.paid).sort((a, b) => a.due.localeCompare(b.due));
  const goalsTotal = state.goals.reduce((s, g) => s + g.saved, 0);
  const goalsTarget = state.goals.reduce((s, g) => s + g.target, 0);

  return '<h1>Good evening, Hartono household</h1>' +
    '<p class="lede">Here is where November 2026 stands — what came in, what went out, and what is left for the goals that matter.</p>' +
    '<div class="grid cols-4">' +
      '<div class="card stat income"><div class="label">Income</div><div class="value">' + money(t.income) + '</div><div class="sub">3 payments in November</div></div>' +
      '<div class="card stat expense"><div class="label">Expenses</div><div class="value">' + money(t.expenses) + '</div><div class="sub">' + state.transactions.filter((x) => x.type === "expense").length + ' purchases &amp; bills</div></div>' +
      '<div class="card stat balance"><div class="label">Balance</div><div class="value">' + money(t.balance) + '</div><div class="sub">Left over this month</div></div>' +
      '<div class="card stat"><div class="label">Savings rate</div><div class="value">' + t.rate.toFixed(1) + '%</div><div class="sub">of income kept, not spent</div></div>' +
    '</div>' +
    '<div class="grid cols-2" style="margin-top:16px">' +
      '<section class="card"><h2>Budgets at a glance</h2>' +
        topBudgets.map((b) => {
          const s = spent[b.category] || 0, p = s / b.limit * 100;
          return '<div class="tight"><div class="rowline"><span>' + esc(b.category) + '</span><span class="num">' + money(s) + ' of ' + money(b.limit) + '</span></div>' + progressBar(p, b.category + " budget") + '</div>';
        }).join("") +
        '<p class="small"><a href="#/budgets">See all budgets →</a></p></section>' +
      '<section class="card"><h2>Savings goals</h2>' +
        '<p class="tight muted small">' + money(goalsTotal) + ' saved toward ' + money(goalsTarget) + ' in goals.</p>' +
        state.goals.map((g) => {
          const p = g.saved / g.target * 100;
          return '<div class="tight"><div class="rowline"><span>' + esc(g.name) + '</span><span class="num">' + money(g.saved) + ' / ' + money(g.target) + '</span></div>' + progressBar(p, g.name) + '</div>';
        }).join("") +
        '<p class="small"><a href="#/goals">Manage goals →</a></p></section>' +
      '<section class="card"><h2>Upcoming bills</h2>' +
        (upcoming.length ? '<ul class="clean">' + upcoming.map((b) => '<li><div class="tx"><div><div class="desc">' + esc(b.name) + '</div><div class="meta">Due ' + fmtDate(b.due) + '</div></div><span class="amt">' + money(b.amount) + '</span></div></li>').join("") + '</ul>'
          : '<p class="muted">Nothing due — every bill this month is paid. Nice work.</p>') +
        '<p class="small"><a href="#/bills">See all bills →</a></p></section>' +
      '<section class="card"><h2>Recent transactions</h2><ul class="clean">' + recent.map(txRow).join("") + '</ul>' +
        '<p class="small"><a href="#/transactions">See all transactions →</a></p></section>' +
    '</div>';
}

function filteredTransactions() {
  const q = txFilter.q.trim().toLowerCase();
  return [...state.transactions]
    .sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id))
    .filter((t) => (txFilter.category === "All" || t.category === txFilter.category) &&
      (txFilter.type === "all" || t.type === txFilter.type) &&
      (!q || t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)));
}

function viewTransactions() {
  const list = filteredTransactions();
  const spent = list.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const earned = list.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const rows = list.map((t) => {
    if (editingTxId === t.id) {
      return '<tr><td><input type="date" value="' + t.date + '" data-edit-field="date"></td>' +
        '<td><input type="text" value="' + esc(t.description) + '" data-edit-field="description"></td>' +
        '<td><select data-edit-field="category">' + categoryOptions(t.category) + '</select></td>' +
        '<td><select data-edit-field="type"><option value="expense"' + (t.type === "expense" ? " selected" : "") + '>Expense</option><option value="income"' + (t.type === "income" ? " selected" : "") + '>Income</option></select></td>' +
        '<td class="num"><input type="number" min="0" step="0.01" value="' + t.amount.toFixed(2) + '" data-edit-field="amount" style="width:110px"></td>' +
        '<td><button type="button" class="small" data-action="save-tx" data-id="' + t.id + '">Save</button> <button type="button" class="small secondary" data-action="cancel-edit">Cancel</button></td></tr>';
    }
    const sign = t.type === "income" ? "+" : "−";
    const cls = t.type === "income" ? "pos" : "neg";
    return '<tr><td>' + fmtDate(t.date) + '</td><td>' + esc(t.description) + '</td><td>' + esc(t.category) + '</td><td>' + (t.type === "income" ? "Income" : "Expense") + '</td>' +
      '<td class="num"><span class="amt ' + cls + '">' + sign + money(t.amount) + '</span></td>' +
      '<td><button type="button" class="small secondary" data-action="edit-tx" data-id="' + t.id + '">Edit</button> <button type="button" class="small danger" data-action="delete-tx" data-id="' + t.id + '">Delete</button></td></tr>';
  }).join("");

  return '<h1>Transactions</h1>' +
    '<p class="lede">Every dollar in and out in November 2026. Add, edit or delete — the dashboard, budgets and reports update at once.</p>' +
    '<div class="card"><h2>Add a transaction</h2><form id="add-tx-form"><div class="formrow">' +
      '<div class="field"><label for="f-date">Date</label><input id="f-date" type="date" value="2026-11-27" required></div>' +
      '<div class="field"><label for="f-desc">Description</label><input id="f-desc" type="text" placeholder="e.g. Weekly groceries" required></div></div>' +
      '<div class="formrow"><div class="field"><label for="f-cat">Category</label><select id="f-cat">' + categoryOptions("Groceries") + '</select></div>' +
      '<div class="field"><label for="f-type">Type</label><select id="f-type"><option value="expense">Expense</option><option value="income">Income</option></select></div></div>' +
      '<div class="formrow"><div class="field"><label for="f-amt">Amount (USD)</label><input id="f-amt" type="number" min="0.01" step="0.01" placeholder="0.00" required></div>' +
      '<div class="field" style="align-self:end"><button type="submit">Add transaction</button></div></div></form></div>' +
    '<div class="card" style="margin-top:16px"><h2>All transactions</h2>' +
    '<div class="toolbar">' +
      '<div class="field"><label for="q">Search</label><input id="q" type="search" placeholder="Search description or category" value="' + esc(txFilter.q) + '"></div>' +
      '<div class="field"><label for="fcat">Category</label><select id="fcat"><option' + (txFilter.category === "All" ? " selected" : "") + '>All</option>' + CATEGORIES.map((c) => '<option' + (txFilter.category === c ? " selected" : "") + '>' + c + '</option>').join("") + '</select></div>' +
      '<div class="field"><label for="ftype">Type</label><select id="ftype"><option value="all"' + (txFilter.type === "all" ? " selected" : "") + '>All</option><option value="income"' + (txFilter.type === "income" ? " selected" : "") + '>Income</option><option value="expense"' + (txFilter.type === "expense" ? " selected" : "") + '>Expense</option></select></div>' +
    '</div>' +
    '<p class="small muted">Showing ' + list.length + ' of ' + state.transactions.length + ' transactions · ' + money(earned) + ' in · ' + money(spent) + ' out</p>' +
    (list.length ? '<div class="tablewrap"><table><thead><tr><th>Date</th><th>Description</th><th>Category</th><th>Type</th><th class="num">Amount</th><th>Actions</th></tr></thead><tbody>' + rows + '</tbody></table></div>'
      : '<p class="empty">No transactions match this filter. Try clearing the search.</p>') +
    '</div>';
}

function viewBudgets() {
  const spent = spentByCategory();
  const totalLimit = state.budgets.reduce((s, b) => s + b.limit, 0);
  const totalSpent = state.budgets.reduce((s, b) => s + (spent[b.category] || 0), 0);
  const cards = state.budgets.map((b) => {
    const s = spent[b.category] || 0, p = s / b.limit * 100, left = b.limit - s;
    const status = p >= 95 ? '<span class="pill red">Over 95% — slow down</span>' : p >= 80 ? '<span class="pill amber">Almost there</span>' : '<span class="pill">On track</span>';
    return '<section class="card"><div class="goalhead"><h3>' + esc(b.category) + '</h3>' + status + '</div>' +
      '<div class="rowline"><span class="muted">Spent</span><span class="num">' + money(s) + '</span></div>' +
      '<div class="rowline"><span class="muted">Budget</span><span class="num">' + money(b.limit) + '</span></div>' +
      '<div class="rowline"><span class="muted">Left</span><span class="num">' + money(left) + '</span></div>' +
      progressBar(p, b.category + " budget") +
      '<div class="quickadd"><label class="small muted" for="budget-' + esc(b.category) + '">Monthly budget</label>' +
      '<input id="budget-' + esc(b.category) + '" type="number" min="0" step="1" value="' + b.limit + '" data-budget-cat="' + esc(b.category) + '">' +
      '<button type="button" class="small secondary" data-action="save-budget" data-cat="' + esc(b.category) + '">Save budget</button></div></section>';
  }).join("");
  return '<h1>Budgets</h1>' +
    '<p class="lede">Monthly limits per category for November 2026. Change any budget and the progress bars update right away.</p>' +
    '<div class="notice">Total budgeted <strong>' + money(totalLimit) + '</strong> · spent so far <strong>' + money(totalSpent) + '</strong> · ' + money(totalLimit - totalSpent) + ' left across all categories.</div>' +
    '<div class="grid cols-2">' + cards + '</div>';
}

function viewGoals() {
  const totalSaved = state.goals.reduce((s, g) => s + g.saved, 0);
  const totalTarget = state.goals.reduce((s, g) => s + g.target, 0);
  const cards = state.goals.map((g) => {
    const p = g.saved / g.target * 100;
    return '<section class="card"><div class="goalhead"><h3>' + esc(g.name) + '</h3><span class="target">' + money(g.saved) + ' of ' + money(g.target) + '</span></div>' +
      '<p class="small muted tight">' + esc(g.note) + '</p>' + progressBar(p, g.name) +
      '<p class="small tight"><strong>' + p.toFixed(0) + '%</strong> funded · ' + money(g.target - g.saved) + ' to go</p>' +
      '<div class="quickadd"><button type="button" class="small secondary" data-action="add-funds" data-id="' + g.id + '" data-amount="25">+$25</button>' +
      '<button type="button" class="small secondary" data-action="add-funds" data-id="' + g.id + '" data-amount="50">+$50</button>' +
      '<button type="button" class="small secondary" data-action="add-funds" data-id="' + g.id + '" data-amount="100">+$100</button>' +
      '<input type="number" min="1" step="1" placeholder="Custom $" data-custom-funds="' + g.id + '">' +
      '<button type="button" class="small" data-action="add-funds-custom" data-id="' + g.id + '">Add</button></div></section>';
  }).join("");
  return '<h1>Savings Goals</h1>' +
    '<p class="lede">What the household is saving for — ' + money(totalSaved) + ' saved toward ' + money(totalTarget) + ' in total.</p>' +
    '<div class="grid cols-3">' + cards + '</div>' +
    '<div class="card" style="margin-top:16px"><h2>Start a new goal</h2><form id="add-goal-form"><div class="formrow">' +
      '<div class="field"><label for="g-name">Goal name</label><input id="g-name" type="text" placeholder="e.g. New washing machine" required></div>' +
      '<div class="field"><label for="g-target">Target amount (USD)</label><input id="g-target" type="number" min="1" step="1" placeholder="1000" required></div></div>' +
      '<div class="formrow"><div class="field"><label for="g-saved">Already saved (USD)</label><input id="g-saved" type="number" min="0" step="1" value="0"></div>' +
      '<div class="field" style="align-self:end"><button type="submit">Add goal</button></div></div></form></div>';
}

function viewBills() {
  const paid = state.bills.filter((b) => b.paid).reduce((s, b) => s + b.amount, 0);
  const upcoming = state.bills.filter((b) => !b.paid);
  const upcomingTotal = upcoming.reduce((s, b) => s + b.amount, 0);
  const rows = [...state.bills].sort((a, b) => a.due.localeCompare(b.due)).map((b) => {
    const pill = b.paid ? '<span class="pill">Paid</span>' : '<span class="pill amber">Upcoming</span>';
    return '<tr><td>' + esc(b.name) + '</td><td>' + fmtDate(b.due) + '</td><td class="num">' + money(b.amount) + '</td><td>' + pill + '</td>' +
      '<td><button type="button" class="small secondary" data-action="toggle-bill" data-id="' + b.id + '">' + (b.paid ? "Mark unpaid" : "Mark paid") + '</button></td></tr>';
  }).join("");
  return '<h1>Bills</h1>' +
    '<p class="lede">Recurring bills for November 2026. Tap a button to mark a bill paid — the totals below follow.</p>' +
    '<div class="notice">Paid this month <strong>' + money(paid) + '</strong> · still upcoming <strong>' + money(upcomingTotal) + '</strong> (' + upcoming.length + ' bill' + (upcoming.length === 1 ? "" : "s") + ').</div>' +
    '<div class="card"><div class="tablewrap"><table><thead><tr><th>Bill</th><th>Due</th><th class="num">Amount</th><th>Status</th><th>Actions</th></tr></thead><tbody>' + rows + '</tbody></table></div></div>' +
    '<div class="card" style="margin-top:16px"><h2>Add a recurring bill</h2><form id="add-bill-form"><div class="formrow">' +
      '<div class="field"><label for="b-name">Bill name</label><input id="b-name" type="text" placeholder="e.g. Water" required></div>' +
      '<div class="field"><label for="b-amt">Amount (USD)</label><input id="b-amt" type="number" min="0.01" step="0.01" placeholder="0.00" required></div></div>' +
      '<div class="formrow"><div class="field"><label for="b-due">Due date</label><input id="b-due" type="date" value="2026-11-30" required></div>' +
      '<div class="field" style="align-self:end"><button type="submit">Add bill</button></div></div></form></div>';
}

function donutSVG() {
  const spent = spentByCategory();
  const cats = Object.keys(spent).sort((a, b) => spent[b] - spent[a]);
  const total = cats.reduce((s, c) => s + spent[c], 0);
  const cx = 110, cy = 110, r = 80, ir = 54;
  let acc = 0;
  const parts = cats.map((c, i) => {
    const frac = spent[c] / total;
    const a0 = acc * Math.PI * 2 - Math.PI / 2, a1 = (acc + frac) * Math.PI * 2 - Math.PI / 2;
    acc += frac;
    const large = frac > 0.5 ? 1 : 0;
    const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    const xi1 = cx + ir * Math.cos(a1), yi1 = cy + ir * Math.sin(a1);
    const xi0 = cx + ir * Math.cos(a0), yi0 = cy + ir * Math.sin(a0);
    return '<path d="M ' + x0.toFixed(1) + ' ' + y0.toFixed(1) + ' A ' + r + ' ' + r + ' 0 ' + large + ' 1 ' + x1.toFixed(1) + ' ' + y1.toFixed(1) +
      ' L ' + xi1.toFixed(1) + ' ' + yi1.toFixed(1) + ' A ' + ir + ' ' + ir + ' 0 ' + large + ' 0 ' + xi0.toFixed(1) + ' ' + yi0.toFixed(1) + ' Z" fill="' + CHART_COLORS[i % CHART_COLORS.length] + '"><title>' + esc(c) + ': ' + money(spent[c]) + '</title></path>';
  }).join("");
  const legend = cats.map((c, i) => {
    const p = spent[c] / total * 100;
    return '<li><span><span class="dot" style="background:' + CHART_COLORS[i % CHART_COLORS.length] + '"></span>' + esc(c) + '</span><span><strong>' + money(spent[c]) + '</strong> · ' + p.toFixed(1) + '%</span></li>';
  }).join("");
  return { svg: '<svg class="chart" viewBox="0 0 220 220" role="img" aria-label="Spending by category">' + parts +
    '<text x="110" y="106" text-anchor="middle" font-size="17" font-weight="800" fill="#1f2937">' + money(total) + '</text>' +
    '<text x="110" y="124" text-anchor="middle" font-size="11" fill="#6b7280">spent in Nov</text></svg>', legend };
}

function barsSVG() {
  const data = state.monthlyTrend;
  const max = Math.max(...data.map((d) => Math.max(d.income, d.expenses)));
  const W = 520, H = 240, base = 205, top = 18, gap = 14, gw = (W - gap * (data.length - 1)) / data.length;
  let bars = "";
  data.forEach((d, i) => {
    const x = i * (gw + gap);
    const ih = (d.income / max) * (base - top);
    const eh = (d.expenses / max) * (base - top);
    const bw = (gw - 8) / 2;
    bars += '<rect x="' + (x).toFixed(1) + '" y="' + (base - ih).toFixed(1) + '" width="' + bw.toFixed(1) + '" height="' + ih.toFixed(1) + '" rx="3" fill="#16a34a"><title>' + d.month + ' income ' + money(d.income) + '</title></rect>' +
      '<rect x="' + (x + bw + 8).toFixed(1) + '" y="' + (base - eh).toFixed(1) + '" width="' + bw.toFixed(1) + '" height="' + eh.toFixed(1) + '" rx="3" fill="#dc2626"><title>' + d.month + ' expenses ' + money(d.expenses) + '</title></rect>' +
      '<text x="' + (x + gw / 2).toFixed(1) + '" y="' + (base + 18) + '" text-anchor="middle" font-size="12" fill="#6b7280">' + d.month + '</text>';
  });
  return '<svg class="chart" viewBox="0 0 ' + W + ' 238" role="img" aria-label="Income versus expenses, June to November 2026">' + bars +
    '<line x1="0" y1="' + base + '" x2="' + W + '" y2="' + base + '" stroke="#e5e7eb" stroke-width="1"/></svg>' +
    '<p class="small muted"><span style="color:#16a34a">■</span> Income &nbsp; <span style="color:#dc2626">■</span> Expenses</p>';
}

function viewReports() {
  const spent = spentByCategory();
  const cats = Object.keys(spent).sort((a, b) => spent[b] - spent[a]);
  const top = cats[0];
  const t = totals();
  const donut = donutSVG();
  const rows = cats.map((c, i) => '<tr><td><span class="dot" style="background:' + CHART_COLORS[i % CHART_COLORS.length] + '"></span> ' + esc(c) + '</td><td class="num">' + money(spent[c]) + '</td><td class="num">' + (spent[c] / t.expenses * 100).toFixed(1) + '%</td></tr>').join("");
  return '<h1>Reports</h1>' +
    '<p class="lede">Where the money went in November 2026 — and how this month compares with the last six.</p>' +
    '<div class="notice">Biggest cost this month: <strong>' + esc(top) + ' at ' + money(spent[top]) + '</strong> (' + (spent[top] / t.expenses * 100).toFixed(1) + '% of all spending). The household kept <strong>' + t.rate.toFixed(1) + '%</strong> of its income.</div>' +
    '<div class="grid cols-2">' +
      '<section class="card"><h2>Spending by category</h2>' + donut.svg + '<ul class="legend">' + donut.legend + '</ul></section>' +
      '<section class="card"><h2>Income vs expenses — Jun to Nov</h2>' + barsSVG() +
        '<div class="tablewrap"><table><thead><tr><th>Category</th><th class="num">Spent</th><th class="num">Share</th></tr></thead><tbody>' + rows + '</tbody></table></div></section>' +
    '</div>';
}

// ---------- router ----------

function route() {
  const hash = (location.hash || "#/").replace(/^#\/?/, "");
  const page = hash.split("/")[0] || "dashboard";
  document.querySelectorAll("[data-nav]").forEach((a) => a.classList.toggle("active", a.dataset.nav === page));
  const app = document.getElementById("app");
  if (page === "transactions") app.innerHTML = viewTransactions();
  else if (page === "budgets") app.innerHTML = viewBudgets();
  else if (page === "goals") app.innerHTML = viewGoals();
  else if (page === "bills") app.innerHTML = viewBills();
  else if (page === "reports") app.innerHTML = viewReports();
  else app.innerHTML = viewDashboard();
  window.scrollTo(0, 0);
  bindPage(page);
}

function bindPage(page) {
  if (page === "transactions") {
    const form = document.getElementById("add-tx-form");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const amount = parseFloat(document.getElementById("f-amt").value);
      const description = document.getElementById("f-desc").value.trim();
      if (!description || !(amount > 0)) return;
      state.transactions.push({
        id: "t" + Date.now().toString(36),
        date: document.getElementById("f-date").value,
        description,
        category: document.getElementById("f-cat").value,
        type: document.getElementById("f-type").value,
        amount: Math.round(amount * 100) / 100
      });
      saveState();
      route();
    });
    document.getElementById("q").addEventListener("input", (e) => { txFilter.q = e.target.value; route(); const q = document.getElementById("q"); q.focus(); q.setSelectionRange(q.value.length, q.value.length); });
    document.getElementById("fcat").addEventListener("change", (e) => { txFilter.category = e.target.value; route(); });
    document.getElementById("ftype").addEventListener("change", (e) => { txFilter.type = e.target.value; route(); });
  }
  if (page === "goals") {
    document.getElementById("add-goal-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("g-name").value.trim();
      const target = parseFloat(document.getElementById("g-target").value);
      const saved = parseFloat(document.getElementById("g-saved").value) || 0;
      if (!name || !(target > 0)) return;
      state.goals.push({ id: "g" + Date.now().toString(36), name, target, saved, note: "Added in November 2026." });
      saveState();
      route();
    });
  }
  if (page === "bills") {
    document.getElementById("add-bill-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("b-name").value.trim();
      const amount = parseFloat(document.getElementById("b-amt").value);
      const due = document.getElementById("b-due").value;
      if (!name || !(amount > 0) || !due) return;
      state.bills.push({ id: "b" + Date.now().toString(36), name, amount: Math.round(amount * 100) / 100, due, paid: false });
      saveState();
      route();
    });
  }
}

document.getElementById("app").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-action]");
  if (!btn) return;
  const action = btn.dataset.action;
  const id = btn.dataset.id;
  if (action === "edit-tx") { editingTxId = id; route(); }
  if (action === "cancel-edit") { editingTxId = null; route(); }
  if (action === "delete-tx") {
    const t = state.transactions.find((x) => x.id === id);
    if (t && window.confirm('Delete "' + t.description + '" (' + money(t.amount) + ')?')) {
      state.transactions = state.transactions.filter((x) => x.id !== id);
      saveState();
      route();
    }
  }
  if (action === "save-tx") {
    const row = btn.closest("tr");
    const get = (f) => row.querySelector('[data-edit-field="' + f + '"]').value;
    const amount = parseFloat(get("amount"));
    const t = state.transactions.find((x) => x.id === id);
    if (t && get("description").trim() && amount > 0 && get("date")) {
      t.date = get("date");
      t.description = get("description").trim();
      t.category = get("category");
      t.type = get("type");
      t.amount = Math.round(amount * 100) / 100;
      saveState();
    }
    editingTxId = null;
    route();
  }
  if (action === "save-budget") {
    const input = document.querySelector('[data-budget-cat="' + btn.dataset.cat + '"]');
    const limit = parseFloat(input.value);
    const b = state.budgets.find((x) => x.category === btn.dataset.cat);
    if (b && limit >= 0) { b.limit = limit; saveState(); route(); }
  }
  if (action === "add-funds") {
    const g = state.goals.find((x) => x.id === id);
    if (g) { g.saved = Math.round((g.saved + parseFloat(btn.dataset.amount)) * 100) / 100; saveState(); route(); }
  }
  if (action === "add-funds-custom") {
    const input = document.querySelector('[data-custom-funds="' + id + '"]');
    const amount = parseFloat(input.value);
    const g = state.goals.find((x) => x.id === id);
    if (g && amount > 0) { g.saved = Math.round((g.saved + amount) * 100) / 100; saveState(); route(); }
  }
  if (action === "toggle-bill") {
    const b = state.bills.find((x) => x.id === id);
    if (b) { b.paid = !b.paid; saveState(); route(); }
  }
});

document.getElementById("reset-demo").addEventListener("click", () => {
  if (window.confirm("Reset all changes back to the November 2026 demo data?")) {
    localStorage.removeItem(STORE_KEY);
    state = loadState();
    txFilter = { q: "", category: "All", type: "all" };
    editingTxId = null;
    route();
  }
});

window.addEventListener("hashchange", route);
route();
