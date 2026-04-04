# CashPilot — Personal Finance Dashboard (Demo)

CashPilot is a responsive, single-page personal finance dashboard built with plain HTML, CSS and vanilla JavaScript. It demonstrates practical frontend skills: state management, DOM manipulation, forms, filtering and sorting, progress UI, small animations and local persistence.

## Features
- Hero banner with CTA that opens the Transactions form or scrolls to Transactions
- Responsive header with accessible hamburger menu and keyboard support (ESC to close)
- Overview cards: Current Balance, Income, Expenses (animated)
- Transactions:
  - Sample transactions array
  - Filters (type, category) and sorting (date, amount)
  - Add Transaction form with validation
- Budgets: per-category limits, progress bars and warning/over states
- Goals: default goals, Add Savings buttons, visual "Achieved" state at 100%
- Alerts/Insights generated from data
- Local persistence using localStorage (key: `cashpilot_v1`)

## Project structure
- index.html — markup
- styles.css — styling and responsive rules
- script.js — application logic, state and event handlers
- README.md — this file

## Usage
1. Open `index.html` in a modern browser.
2. Use the "Add Transaction" button to add transactions.
3. Filter/sort transactions, set budgets and add savings to goals.
4. Data persists in browser localStorage. To reset, remove the `cashpilot_v1` key.

## Implementation notes
- ES6+ (const/let, arrow functions, template strings)
- No external libraries
- Focus on modular functions: render, handlers, utilities

## Contributors
- Add your names here.

## License
MIT (add LICENSE file if needed)


### Notes about currency
This demo uses Euro (EUR) as the display currency. Replace formatting or locale in `script.js` if you need another currency or localization.