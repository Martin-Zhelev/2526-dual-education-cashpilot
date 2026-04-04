const hamburger = document.querySelector('.hamburger');
const nav = document.querySelector('.nav');
hamburger.addEventListener('click', () => {
  nav.classList.toggle('active');
});

document.addEventListener("DOMContentLoaded", () => {
  const cta = document.getElementById("add-transaction-btn");
  if (cta) {
    cta.addEventListener("click", () => {
      // If a transaction form exists, show it and focus date
      const txForm = document.getElementById("txForm");
      if (txForm) {
        txForm.classList.remove("hidden");
        document.getElementById("txDate")?.focus();
        txForm.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }

      // If there's an "Add Transaction" button in the transactions section, trigger it
      const addBtn = document.getElementById("add-transaction");
      if (addBtn) {
        addBtn.scrollIntoView({ behavior: "smooth", block: "center" });
        addBtn.focus();
        // optional: simulate click to open form if button has handler
        addBtn.click();
        return;
      }

      // fallback: scroll to transactions section
      document.getElementById("transactions")?.scrollIntoView({ behavior: "smooth" });
    });
  }
});
const financeData = {
  balance: 2450.30,
  income: 1800.00,
  expenses: 950.40
};

const balanceCard = document.getElementById('balance-card');
const incomeCard = document.getElementById('income-card');
const expensesCard = document.getElementById('expenses-card');

function animateValue(element, start, end, duration) {
  let range = end - start;
  let current = start;
  let increment = range / (duration / 16);
  function step() {
    current += increment;
    if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
      current = end;
    } else {
      requestAnimationFrame(step);
    }
    element.textContent = element.id.includes('balance') ? `Current Balance: ${current.toFixed(2)}` :
                          element.id.includes('income') ? `Income (This Month): ${current.toFixed(2)}` :
                          `Expenses (This Month): ${current.toFixed(2)}`;
  }
  step();
}

window.addEventListener('load', () => {
  animateValue(balanceCard, 0, financeData.balance, 1000);
  animateValue(incomeCard, 0, financeData.income, 1000);
  animateValue(expensesCard, 0, financeData.expenses, 1000);
});

// Add a simple state with example transactions
const state = {
  transactions: [
    { id: "t1", date: "2026-01-05", description: "Salary", category: "Salary", amount: 1800.00, type: "income" },
    { id: "t2", date: "2026-01-07", description: "Groceries", category: "Food", amount: 120.40, type: "expense" },
    { id: "t3", date: "2026-01-10", description: "Transport pass", category: "Transport", amount: 45.00, type: "expense" },
    { id: "t4", date: "2026-01-12", description: "Internet", category: "Bills", amount: 29.99, type: "expense" }
  ]
};

function escapeHtml(s){
  return String(s)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

function uniqueCategories(){
  const set = new Set();
  for (const t of state.transactions) set.add(t.category);
  return Array.from(set).sort((a,b)=>a.localeCompare(b));
}

function getFilteredSorted(){
  const type = document.getElementById("typeFilter")?.value ?? "all";
  const cat = document.getElementById("catFilter")?.value ?? "all";
  const sortBy = document.getElementById("sortBy")?.value ?? "date_desc";

  let list = state.transactions.slice();

  if (type !== "all") list = list.filter(t => t.type === type);
  if (cat !== "all") list = list.filter(t => t.category === cat);

  const byDate = (a,b) => new Date(a.date) - new Date(b.date);
  const byAmt = (a,b) => a.amount - b.amount;

  if (sortBy === "date_asc") list.sort(byDate);
  if (sortBy === "date_desc") list.sort((a,b)=>byDate(b,a));
  if (sortBy === "amt_asc") list.sort(byAmt);
  if (sortBy === "amt_desc") list.sort((a,b)=>byAmt(b,a));

  return list;
}

function renderTransactions(){
  const body = document.getElementById("txBody");
  const catFilter = document.getElementById("catFilter");
  if (!body || !catFilter) return;

  // populate categories dropdown
  const current = catFilter.value || "all";
  const cats = uniqueCategories();
  catFilter.innerHTML = `<option value="all">All categories</option>` + cats.map(c => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join("");
  catFilter.value = cats.includes(current) ? current : "all";

  const list = getFilteredSorted();
  body.innerHTML = list.map(t => {
    const sign = t.type === "expense" ? "-" : "+";
    const amt = `${sign}${t.amount.toFixed(2)} BGN`;
    return `
      <tr>
        <td>${escapeHtml(t.date)}</td>
        <td>${escapeHtml(t.description)}</td>
        <td>${escapeHtml(t.category)}</td>
        <td class="right">${escapeHtml(amt)}</td>
        <td>${escapeHtml(t.type)}</td>
      </tr>
    `;
  }).join("");
}

function calcSummary(){
  let income = 0, expenses = 0;
  for (const t of state.transactions){
    if (t.type === "income") income += t.amount;
    else expenses += t.amount;
  }
  const balance = income - expenses;
  return { income, expenses, balance };
}

function updateOverviewCards(){
  const balEl = document.getElementById('balance-card');
  const incEl = document.getElementById('income-card');
  const expEl = document.getElementById('expenses-card');
  if (!balEl || !incEl || !expEl) return;
  const { income, expenses, balance } = calcSummary();
  balEl.textContent = `Current Balance: ${balance.toFixed(2)}`;
  incEl.textContent = `Income (This Month): ${income.toFixed(2)}`;
  expEl.textContent = `Expenses (This Month): ${expenses.toFixed(2)}`;
}

function setupTransactionsUI(){
  const toggleBtn = document.getElementById("toggleFormBtn");
  const form = document.getElementById("txForm");
  const err = document.getElementById("formErr");
  const cancelBtn = document.getElementById("cancelTx");

  const rerenderOn = ["typeFilter","catFilter","sortBy"];
  for (const id of rerenderOn){
    document.getElementById(id)?.addEventListener("change", () => renderTransactions());
  }

  if (toggleBtn && form){
    toggleBtn.addEventListener("click", () => {
      form.classList.toggle("hidden");
      if (!form.classList.contains("hidden")){
        document.getElementById("txDate")?.focus();
      }
    });
  }

  if (cancelBtn && form){
    cancelBtn.addEventListener("click", () => {
      form.classList.add("hidden");
      if (err) { err.classList.add("hidden"); err.textContent=""; }
      form.reset();
    });
  }

  if (form){
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (err) { err.classList.add("hidden"); err.textContent=""; }

      const date = document.getElementById("txDate")?.value?.trim() || "";
      const desc = document.getElementById("txDesc")?.value?.trim() || "";
      const cat  = document.getElementById("txCat")?.value?.trim() || "";
      const type = document.getElementById("txType")?.value || "expense";
      const amtRaw = document.getElementById("txAmt")?.value || "";
      const amt = Number(amtRaw);

      if (!date || !desc || !cat || !Number.isFinite(amt) || amt <= 0){
        if (err){
          err.textContent = "Invalid input. Fill all fields. Amount must be > 0.";
          err.classList.remove("hidden");
        }
        return;
      }

      state.transactions.push({
        id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `t${Date.now()}`,
        date,
        description: desc,
        category: cat,
        amount: Math.round(amt * 100) / 100,
        type
      });

      form.reset();
      form.classList.add("hidden");
      renderTransactions();
      updateOverviewCards();
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // existing initialization (hamburger + cta code) has already run earlier in file
  setupTransactionsUI();
  renderTransactions();
  updateOverviewCards();
});
const budgets = [
  { category: "Food", limit: 500, spent: 350 },
  { category: "Transport", limit: 200, spent: 180 },
  { category: "Bills", limit: 400, spent: 420 },
  { category: "Fun", limit: 150, spent: 120 },
  { category: "Other", limit: 100, spent: 90 }
];

const budgetList = document.querySelector('.budget-list');

function renderBudgets() {
  budgetList.innerHTML = '';
  budgets.forEach(b => {
    const percent = Math.min((b.spent / b.limit) * 100, 100);
    let statusClass = '';
    if (percent > 100) statusClass = 'over';
    else if (percent > 80) statusClass = 'warning';
    const item = document.createElement('div');
    item.className = `budget-item ${statusClass}`;
    item.innerHTML = `${b.category}: <span class="spent">${b.spent}</span>/<span class="limit">${b.limit}</span>
      <div class="progress-bar"><div class="progress" style="width: ${percent}%"></div></div>`;
    budgetList.appendChild(item);
  });
}

renderBudgets();
