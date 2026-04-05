# CashPilot 💸
### Personal Finance Dashboard

> A zero-dependency, single-page finance dashboard that puts full control of your money in the browser — no backend, no sign-up, no friction.

---

## 🚀 What We Built

CashPilot is a fully client-side personal finance dashboard built with **plain HTML, CSS, and vanilla JavaScript**. In 48 hours, we designed and shipped a polished, responsive application that lets anyone track income, expenses, budgets, and savings goals — entirely in the browser.

No frameworks. No build tools. Just the web platform.

---

## ✨ Features

| Area | What it does |
|---|---|
| **Overview** | Animated balance, income, and expense cards updated in real time |
| **Transactions** | Add, filter by type/category, and sort by date or amount |
| **Budgets** | Per-category spending limits with live progress bars and over-budget alerts |
| **Goals** | Savings goals with visual progress and an "Achieved" state at 100% |
| **Insights** | Auto-generated alerts and tips derived from your actual data |
| **Persistence** | Full state saved to `localStorage` — data survives page refreshes |
| **Accessibility** | Keyboard-navigable hamburger menu, ESC-to-close, semantic HTML |

---

## 🛠 Tech Stack

- **Vanilla JS (ES6+)** — arrow functions, template literals, destructuring, modules
- **CSS3** — custom properties, flexbox/grid, responsive breakpoints, keyframe animations
- **Web Storage API** — client-side persistence via `localStorage`
- **Zero dependencies** — no npm, no bundler, no frameworks

---

## 📁 Project Structure

```
cashpilot/
├── index.html      # Application markup and layout
├── styles.css      # Theming, responsive rules, animations
├── script.js       # State management, event handlers, render logic
└── README.md       # This file
```

---

## ⚡ Quick Start

```bash
# Clone the repo
git clone https://github.com/your-team/cashpilot.git

# Open in browser — no install required
open index.html
```

Or just drag `index.html` into any modern browser tab.

**To reset all data:** open DevTools → Application → Local Storage → delete the `cashpilot_v1` key.

---

## 🏗 Architecture

CashPilot follows a simple unidirectional data flow:

```
User Action → Update State → Persist to localStorage → Re-render UI
```

State is held in a single JavaScript object and all UI is derived from it, making the app predictable and easy to debug. Key modules:

- **`render*()`** — pure functions that paint UI from state
- **`handle*()`** — event handlers that mutate state and trigger re-renders
- **utility functions** — filtering, sorting, formatting, and insight generation

---

## Documentation

<li> <a href = "https://codingburgas-my.sharepoint.com/:w:/g/personal/majelev24_codingburgas_bg/IQCHRUfEHYT_RJguvf_q4-9IAc0hVxUmfHL_anmDUo6rG2A?e=ChwnSq"</a> Presentation

<li> <a href = "https://codingburgas-my.sharepoint.com/:w:/g/personal/majelev24_codingburgas_bg/IQCHRUfEHYT_RJguvf_q4-9IAc0hVxUmfHL_anmDUo6rG2A?e=ChwnSq"</a> Documentation

## 🌍 Notes

- Display currency: **EUR (€)**
- Tested in: Chrome 120+, Firefox 121+, Safari 17+
- Mobile-first responsive design

---

## 👥 Team

| Name | Role |
|---|---|
| Daniil Zarubin | Frontend & Architecture |
| Martin Zhelev | UI Design & Logic |

---

## 📄 License

© 2025 Cashpilot Inc. All rights reserved.
