// Retrieve transactions from localStorage or initialize an empty array
const transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// Formatter for currency display
const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  signDisplay: "always",
});

// DOM elements
const list = document.getElementById("transactionList");
const form = document.getElementById("transactionForm");
const status = document.getElementById("status");
const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");

// Event listener for form submission
form.addEventListener("submit", addTransaction);

// Function to update total balance, income, and expenses
function updateTotal() {
  // Calculate total income
  const incomeTotal = transactions
    .filter((trx) => trx.type === "income")
    .reduce((total, trx) => total + trx.amount, 0);

  // Calculate total expenses
  const expenseTotal = transactions
    .filter((trx) => trx.type === "expense")
    .reduce((total, trx) => total + trx.amount, 0);

  // Calculate balance 
  const balanceTotal = incomeTotal - expenseTotal;

  // Update DOM with formatted values
  balance.textContent = formatter.format(balanceTotal).substring(1); // Remove currency symbol from balance
  income.textContent = formatter.format(incomeTotal);
  expense.textContent = formatter.format(expenseTotal * -1); // Display expenses as negative values
}

// Function to render transaction list
function renderList() {
  list.innerHTML = ""; // Clear previous list

  status.textContent = "";
  if (transactions.length === 0) {
    status.textContent = "No transactions."; // Display message if no transactions
    return;
  }
  // Iterate through transactions and create list items
  transactions.forEach(({ id, name, amount, date, type }) => {
    const sign = "income" === type ? 1 : -1;

    const li = document.createElement("li");

    // Populate list item HTML
    li.innerHTML = `
      <div class="name">
        <h4>${name}</h4>
        <p>${new Date(date).toLocaleDateString()}</p>
      </div>

      <div class="amount ${type}">
        <span>${formatter.format(amount * sign)}</span>
      </div>
    
      <div class="action">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" onclick="deleteTransaction(${id})">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    `;

    list.appendChild(li); // Append list item to the list
  });
}

// Initial rendering of list and updating totals
renderList();
updateTotal();

// Function to delete a transaction
function deleteTransaction(id) {
  const index = transactions.findIndex((trx) => trx.id === id);
  transactions.splice(index, 1); // Remove transaction from array

  updateTotal(); // Update totals
  saveTransactions(); // Save updated transactions to localStorage
  renderList(); // Re-render transaction list
}

// Function to add a new transaction
function addTransaction(e) {
  e.preventDefault();

  const formData = new FormData(this);

  // Create new transaction object and add to transactions array
  transactions.push({
    id: transactions.length + 1,
    name: formData.get("name"),
    amount: parseFloat(formData.get("amount")),
    date: new Date(formData.get("date")),
    type: "on" === formData.get("type") ? "income" : "expense",
  });

  this.reset(); // Reset form fields

  updateTotal(); // Updates totals
  saveTransactions(); // Save update transactions to localStorage
  renderList(); // Re-render transaction list
}

// Function to save transactions to localStorage
function saveTransactions() {
  transactions.sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort transactions by date

  localStorage.setItem("transactions", JSON.stringify(transactions)); // Save transactions to localStorage
}