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