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

const qs = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

const hamburger = document.querySelector('.hamburger');
const nav = document.querySelector('.nav');

if (hamburger) {
  hamburger.addEventListener('click', () => {
    const active = nav.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', String(active));
  });
}

document.addEventListener('click', (e) => {
  if (e.target instanceof HTMLAnchorElement && e.target.closest('.nav')) {
    nav?.classList.remove('active');
    hamburger?.setAttribute('aria-expanded', 'false');
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (nav?.classList.contains('active')) {
      nav.classList.remove('active');
      hamburger?.setAttribute('aria-expanded', 'false');
    }
  }
});

document.addEventListener("DOMContentLoaded", () => {
  loadState();

  // nav buttons: smooth scroll to target and close mobile nav
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-target');
      if (target) {
        const el = document.querySelector(target);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      const navEl = document.getElementById('nav');
      if (navEl?.classList.contains('open')) {
        navEl.classList.remove('open');
        document.getElementById('menuBtn')?.setAttribute('aria-expanded', 'false');
      }
    });
  });

  setupTransactionsUI();
  renderTransactions();
  updateOverviewCards();
  renderGoals();
  renderBudgets();
  renderAlerts();
  saveState();
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
    { id: "g2", name: "Laptop", target: 2500, current: 900 },
    { id: "g3", name: "Vacation", target: 1500, current: 150 }
  ],
  budgets: {
    Food: 600,
    Transport: 200,
    Bills: 180,
    Fun: 150,
    Other: 120
  }
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

  const current = catFilter.value || "all";
  const cats = uniqueCategories();
  catFilter.innerHTML = `<option value="all">All categories</option>` + cats.map(c => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join("");
  catFilter.value = cats.includes(current) ? current : "all";

  const list = getFilteredSorted();
  body.innerHTML = list.map(t => {
    const sign = t.type === "expense" ? "-" : "+";
    const amt = `${sign}${t.amount.toFixed(2)} EUR`;
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
        <div class="budget-top">
          <div>
            <strong>${escapeHtml(cat)}</strong><br/>
            <span class="badge">${fmtCurrency(used)} / ${fmtCurrency(limit)}</span>
          </div>
          <div class="badge">${Math.round(limit>0? (used/limit)*100:0)}%</div>
        </div>
        <div class="bar"><div style="width:${pct}%"></div></div>
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
      msgs.push(`Превишихте бюджета за ${cat} с ${fmtCurrency(used - limit)}.`);
    } else if (limit > 0 && used / limit >= 0.8){
      msgs.push(`Близо сте до бюджета за ${cat} (${Math.round((used/limit)*100)}%).`);
    }
  }

  if (income > 0){
    const savings = income - expenses;
    const rate = savings / income;
    if (rate < 0.10) msgs.push(`Нисък процент спестяване (${Math.round(rate*100)}%).`);
    else if (rate >= 0.20) msgs.push(`Отлично — процент спестяване ${Math.round(rate*100)}%.`);
  } else {
    msgs.push("Няма записан доход този месец.");
  }

  if (state.transactions.length < 5){
    msgs.push("Добавете още транзакции, за да получите по-точни съвети.");
  }

  wrap.innerHTML = (msgs.length ? msgs : ["Няма известия."]).map(m => `
    <div class="card"><p>${escapeHtml(m)}</p></div>
  `).join("");
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
      renderTransactions();
      updateOverviewCards();
      renderBudgets();
      renderAlerts();
      saveState();
    });
  }
}

function renderGoals(){
  const wrap = document.querySelector('.goals-list');
  if (!wrap) return;

  wrap.innerHTML = state.goals.map(g => {
    const pct = g.target <= 0 ? 0 : Math.min(100, Math.round((g.current / g.target) * 100));
    const achieved = pct >= 100;
    return `
      <div class="goal-item ${achieved ? 'achieved' : ''}" data-id="${g.id}">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;">
          <div>
            <strong>${escapeHtml(g.name)}</strong><br/>
            <span class="goal-badge">${escapeHtml(g.current.toFixed(2))} / ${escapeHtml(g.target.toFixed(2))} EUR</span>
          </div>
          <div class="goal-percent">${pct}%</div>
        </div>

        <div class="progress-bar" aria-hidden="true" style="margin-top:8px;">
          <div class="progress" style="width:${pct}%;"></div>
        </div>

        <div style="margin-top:8px; display:flex; gap:8px; align-items:center;">
          ${achieved ? '<span class="goal-status">Achieved</span>' : `<button class="btn goal-add" data-id="${g.id}" type="button">Add 50 EUR</button>`}
        </div>
      </div>
    `;
  }).join("");

  // attach listeners only for active (not achieved) buttons
  qsa('.goal-add', wrap).forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const goal = state.goals.find(g => g.id === id);
      if (!goal) return;
      // cap addition so we don't exceed target
      const add = 50;
      goal.current = Math.min(goal.target, Math.round((goal.current + add) * 100) / 100);
      renderGoals();
      updateOverviewCards();
      renderBudgets();
      renderAlerts();
      saveState();
    });
  });
}

const globalAddSavings = document.getElementById('add-savings');
if (globalAddSavings) {
  globalAddSavings.addEventListener('click', () => {
    if (state.goals.length === 0) return;
    const goal = state.goals[0];
    if (!goal) return;
    goal.current = Math.min(goal.target, Math.round((goal.current + 50) * 100) / 100);
    renderGoals();
    updateOverviewCards();
    renderBudgets();
    renderAlerts();
    saveState();
  });
}
const loginScreen = document.getElementById('login-screen');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout');

if (!localStorage.getItem('loggedIn')) {
  loginScreen.style.display = 'flex';
} else {
  loginScreen.style.display = 'none';
}

loginBtn.addEventListener('click', () => {
  const username = document.getElementById('username').value;
  if (username.trim() !== '') {
    localStorage.setItem('loggedIn', 'true');
    loginScreen.style.display = 'none';
  }
});

logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('loggedIn');
  location.reload();
});
