const form = document.getElementById("expense-form");
const descInput = document.getElementById("desc");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const filterInput = document.getElementById("filter");
const list = document.getElementById("list");
const totalEl = document.getElementById("total");

// Load saved expenses, or start with an empty list
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

function saveExpenses() {
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

function render() {
  const filter = filterInput.value;
  const visible = filter === "All"
    ? expenses
    : expenses.filter(e => e.category === filter);

  // Clear the list, then rebuild it
  list.innerHTML = "";
  let total = 0;

  visible.forEach(exp => {
    total += exp.amount;

    const li = document.createElement("li");

    const info = document.createElement("span");
    info.textContent = exp.desc + " ";
    const cat = document.createElement("small");
    cat.textContent = "(" + exp.category + ")";
    info.appendChild(cat);

    const amount = document.createElement("span");
    amount.textContent = exp.amount.toFixed(2);

    const btn = document.createElement("button");
    btn.textContent = "✕";
    btn.dataset.id = exp.id;

    li.append(info, amount, btn);
    list.appendChild(li);
  });

  totalEl.textContent = total.toFixed(2);
}

// Add a new expense
form.addEventListener("submit", (event) => {
  event.preventDefault(); // Stop the page from reloading

  const expense = {
    id: Date.now(),
    desc: descInput.value.trim(),
    amount: parseFloat(amountInput.value),
    category: categoryInput.value
  };

  expenses.push(expense);
  saveExpenses();
  render();

  form.reset();
  descInput.focus();
});

// Delete an expense (event delegation: one listener for all buttons)
list.addEventListener("click", (event) => {
  if (event.target.tagName === "BUTTON") {
    const id = Number(event.target.dataset.id);
    expenses = expenses.filter(e => e.id !== id);
    saveExpenses();
    render();
  }
});

// Re-render when the filter changes
filterInput.addEventListener("change", render);

// Show saved data on page load
render();