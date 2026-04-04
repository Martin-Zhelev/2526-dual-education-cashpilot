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
