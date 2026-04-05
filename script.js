"use strict";

const STORAGE_KEY = "findash_v1";

function saveState() {
  try {
    const payload = {
      transactions: state.transactions,
      goals: state.goals,
      budgets: state.budgets
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (e) {}
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const p = JSON.parse(raw);
    if (p && Array.isArray(p.transactions)) {
      state.transactions = p.transactions;
    }
    if (p && Array.isArray(p.goals)) {
      state.goals = p.goals;
    }
    if (p && p.budgets && typeof p.budgets === 'object') {
      state.budgets = p.budgets;
    }
  } catch (e) {}
}

document.addEventListener("DOMContentLoaded", () => {
  loadState();

  setupNavigation();
  syncAuthUI();

  setupTransactionsUI();
  renderApp();
});

function animateValue(element, start, end, duration = 800) {
  if (!element) return;
  const range = end - start;
  const startTime = performance.now();
  function frame(now) {
    const t = Math.min(1, (now - startTime) / duration);
    const value = start + range * t;
    element.textContent = value.toFixed(2) + (element.dataset.suffix || "");
    if (t < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

const state = {
  transactions: [
    { id: "t1", date: "2026-01-05", description: "Salary", category: "Salary", amount: 1800.00, type: "income" },
    { id: "t2", date: "2026-01-07", description: "Groceries", category: "Food", amount: 120.40, type: "expense" },
    { id: "t3", date: "2026-01-10", description: "Transport pass", category: "Transport", amount: 45.00, type: "expense" },
    { id: "t4", date: "2026-01-12", description: "Internet", category: "Bills", amount: 29.99, type: "expense" }
  ],
  goals: [
    { id: "g1", name: "Emergency fund", target: 3000, current: 600 },
    { id: "g2", name: "Laptop", target: 2500, current: 900 }
  ],
  budgets: {
    Food: 600,
    Transport: 200,
    Bills: 180,
    Fun: 150,
    Other: 120
  }
};

const DEFAULT_BUDGETS = {
  Food: 600,
  Transport: 200,
  Bills: 180,
  Fun: 150,
  Other: 120
};

const DEFAULT_GOALS = [
  { id: "g1", name: "Emergency fund", target: 3000, current: 600 },
  { id: "g2", name: "Laptop", target: 2500, current: 900 }
];

function renderApp() {
  renderTransactions();
  updateOverviewCards();
  renderGoals();
  renderBudgets();
  renderAlerts();
  saveState();
}

function setupNavigation() {
  document.querySelectorAll(".nav-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.getAttribute("data-target");
      if (!target) return;

      const section = document.querySelector(target);
      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
}

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

  const current = catFilter.value || "all";
  const cats = uniqueCategories();
  catFilter.innerHTML = `<option value="all">All categories</option>` + cats.map(c => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join("");
  catFilter.value = cats.includes(current) ? current : "all";

  const list = getFilteredSorted();
  body.innerHTML = list.map(t => {
    const sign = t.type === "expense" ? "-" : "+";
    const amt = `${sign}${t.amount.toFixed(2)} EUR`;
    const typeClass = t.type === "expense" ? "pill pill-expense" : "pill pill-income";
    return `
      <tr>
        <td>${escapeHtml(t.date)}</td>
        <td>${escapeHtml(t.description)}</td>
        <td>${escapeHtml(t.category)}</td>
        <td class="right">${escapeHtml(amt)}</td>
        <td><span class="${typeClass}">${escapeHtml(t.type)}</span></td>
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
  const balEl = document.getElementById('balValue');
  const incEl = document.getElementById('incValue');
  const expEl = document.getElementById('expValue');
  if (!balEl || !incEl || !expEl) return;
  const { income, expenses, balance } = calcSummary();
  balEl.dataset.suffix = " EUR";
  incEl.dataset.suffix = " EUR";
  expEl.dataset.suffix = " EUR";
  animateValue(balEl, parseFloat(balEl.dataset.last || 0), balance, 600);
  animateValue(incEl, parseFloat(incEl.dataset.last || 0), income, 600);
  animateValue(expEl, parseFloat(expEl.dataset.last || 0), expenses, 600);
  balEl.dataset.last = balance;
  incEl.dataset.last = income;
  expEl.dataset.last = expenses;
}

function spentByCategory(){
  const map = new Map();
  for (const t of state.transactions){
    if (t.type !== "expense") continue;
    map.set(t.category, (map.get(t.category) || 0) + t.amount);
  }
  return map;
}

function renderBudgets(){
  const wrap = document.getElementById("budgetsWrap");
  if (!wrap) return;

  const spent = spentByCategory();
  const entries = Object.entries(state.budgets);

  wrap.innerHTML = entries.map(([cat, limit]) => {
    const used = spent.get(cat) || 0;
    const pct = limit <= 0 ? 0 : Math.min(200, (used / limit) * 100);
    const cls = used > limit ? "over" : (used / limit >= 0.8 ? "warning" : "");
    return `
      <div class="budget ${cls}">
        <div class="budget-header">
          <div class="budget-copy">
            <span class="budget-label">${escapeHtml(cat)}</span>
            <span class="badge">${fmtCurrency(used)} / ${fmtCurrency(limit)}</span>
          </div>
          <div class="budget-percent">${Math.round(limit > 0 ? (used / limit) * 100 : 0)}%</div>
        </div>
        <progress class="meter" max="200" value="${pct}">${pct}</progress>
      </div>
    `;
  }).join("");
}

function renderAlerts(){
  const wrap = document.getElementById("alertsWrap");
  if (!wrap) return;

  const msgs = [];
  const { income, expenses } = calcSummary();

  const spent = spentByCategory();
  for (const [cat, limit] of Object.entries(state.budgets)){
    const used = spent.get(cat) || 0;
    if (limit > 0 && used > limit){
      msgs.push({ type: 'danger', text: `Превишихте бюджета за ${cat} с ${fmtCurrency(used - limit)}.` });
    } else if (limit > 0 && used / limit >= 0.8){
      msgs.push({ type: 'warning', text: `Близо сте до бюджета за ${cat} (${Math.round((used/limit)*100)}%).` });
    } else {
      // ok state optional
      msgs.push({ type: 'ok', text: `В нормата: ${cat} (${Math.round((used/limit||0)*100)}%).` });
    }
  }

  if (income > 0){
    const savings = income - expenses;
    const rate = savings / income;
    if (rate < 0.10) msgs.push({ type: 'warning', text: `Нисък процент спестяване (${Math.round(rate*100)}%).` });
    else if (rate >= 0.20) msgs.push({ type: 'ok', text: `Отлично — процент спестяване ${Math.round(rate*100)}%.` });
  } else {
    msgs.push({ type: 'warning', text: "Няма записан доход този месец." });
  }



  // reduce messages to unique by text
  const seen = new Set();
  const filtered = msgs.filter(m => { if (seen.has(m.text)) return false; seen.add(m.text); return true; });

  wrap.innerHTML = filtered.map(m => {
    const cls = m.type === 'danger' ? 'alert-danger' : (m.type === 'warning' ? 'alert-warning' : (m.type === 'ok' ? 'alert-success' : 'alert-info'));
    const icon = m.type === 'danger' ? '⚠️' : (m.type === 'warning' ? '📉' : (m.type === 'ok' ? '✅' : '💡'));
    return `
      <div class="alert ${cls}">
        <span class="alert-icon">${icon}</span>
        <span class="alert-text">${escapeHtml(m.text)}</span>
      </div>
    `;
  }).join('');
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
        id: (typeof crypto !== "undefined" && crypto.randomUUID) ? crypto.randomUUID() : `t${Date.now()}`,
        date,
        description: desc,
        category: cat,
        amount: Math.round(amt * 100) / 100,
        type
      });

      form.reset();
      form.classList.add("hidden");
      renderApp();
    });
  }
}

function renderGoals(){
  const wrap = document.getElementById("goalsWrap");
  if (!wrap) return;

  wrap.innerHTML = state.goals.map(g => {
    const pct = g.target <= 0 ? 0 : Math.min(100, Math.round((g.current / g.target) * 100));
    const achieved = pct >= 100;
    return `
      <div class="goal-item ${achieved ? 'achieved' : ''}" data-id="${g.id}">
        <div class="goal-header">
          <div class="goal-copy">
            <span class="goal-name">${escapeHtml(g.name)}</span>
            <span class="goal-target">${escapeHtml(g.current.toFixed(2))} / ${escapeHtml(g.target.toFixed(2))} EUR</span>
          </div>
          <div class="goal-percent">${pct}%</div>
        </div>

        <progress class="meter" max="100" value="${pct}">${pct}</progress>

        <div class="goal-actions">
          ${achieved ? '<span class="goal-status">Achieved</span>' : `<button class="btn btn-secondary goal-add" data-id="${g.id}" type="button">Add 50 EUR</button>`}
        </div>
      </div>
    `;
  }).join("");

  // attach listeners only for active (not achieved) buttons
  wrap.querySelectorAll(".goal-add").forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const goal = state.goals.find(g => g.id === id);
      if (!goal) return;
      const add = 50;
      goal.current = Math.min(goal.target, Math.round((goal.current + add) * 100) / 100);
      renderApp();
    });
  });
}

const loginScreen = document.getElementById('login-screen');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout');

function syncAuthUI() {
  if (!loginScreen) return;
  const loggedIn = localStorage.getItem('loggedIn') === 'true';
  loginScreen.classList.toggle('hidden', loggedIn);
  loginScreen.setAttribute('aria-hidden', String(loggedIn));
}

syncAuthUI();

loginBtn?.addEventListener('click', () => {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  const email = document.getElementById('email').value.trim();

  if (!username || !password || !email) {
    alert('All fields are required.');
    return;
  }
  if (!email.includes('@')) {
    alert('Email must contain @');
    return;
  }

  localStorage.setItem('loggedIn', 'true');
  syncAuthUI();
});

logoutBtn?.addEventListener('click', () => {
  localStorage.removeItem('loggedIn');
  syncAuthUI();
});

function fmtCurrency(x){
  try{
    return new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }).format(Number(x));
  }catch{ return String(x); }
}
