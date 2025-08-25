class BudgetTracker {
  constructor() {
    this.transactions = JSON.parse(localStorage.getItem('budget-transactions') || '[]');
    this.currentFilter = 'all';
    this.initializeElements();
    this.bindEvents();
    this.render();
  }

  initializeElements() {
    this.form = document.getElementById('budget-form');
    this.descriptionInput = document.getElementById('description');
    this.amountInput = document.getElementById('amount');
    this.typeSelect = document.getElementById('type');
    this.balanceEl = document.getElementById('balance');
    this.totalIncomeEl = document.getElementById('total-income');
    this.totalExpensesEl = document.getElementById('total-expenses');
    this.transactionList = document.getElementById('transaction-list');
    this.filterBtns = document.querySelectorAll('.filter-btn');
  }

  bindEvents() {
    this.form.addEventListener('submit', (e) => this.addTransaction(e));
    this.filterBtns.forEach(btn => {
      btn.addEventListener('click', (e) => this.setFilter(e.target.dataset.filter));
    });
  }

  addTransaction(e) {
    e.preventDefault();
    
    const description = this.descriptionInput.value.trim();
    const amount = parseFloat(this.amountInput.value);
    const type = this.typeSelect.value;

    if (!description || !amount || amount <= 0) {
      this.showNotification('Please fill in all fields correctly', 'error');
      return;
    }

    const transaction = {
      id: Date.now(),
      description,
      amount,
      type,
      date: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    this.transactions.unshift(transaction);
    this.saveToStorage();
    this.render();
    this.form.reset();
    this.showNotification(${type === 'income' ? 'Income' : 'Expense'} added successfully!, 'success');
  }

  deleteTransaction(id) {
    this.transactions = this.transactions.filter(t => t.id !== id);
    this.saveToStorage();
    this.render();
    this.showNotification('Transaction deleted', 'success');
  }

  setFilter(filter) {
    this.currentFilter = filter;
    this.filterBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filter === filter);
    });
    this.renderTransactions();
  }

  calculateTotals() {
    const income = this.transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = this.transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      income,
      expenses,
      balance: income - expenses
    };
  }

  formatCurrency(amount) {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2
    }).format(amount).replace('NGN', '₦');
  }

  renderStats() {
    const { income, expenses, balance } = this.calculateTotals();
    
    this.balanceEl.textContent = this.formatCurrency(balance);
    this.totalIncomeEl.textContent = this.formatCurrency(income);
    this.totalExpensesEl.textContent = this.formatCurrency(expenses);
    
    // Update balance card color based on positive/negative
    const balanceCard = this.balanceEl.closest('.stat-card');
    balanceCard.classList.remove('income', 'expenses');
    if (balance >= 0) {
      balanceCard.classList.add('income');
    } else {
      balanceCard.classList.add('expenses');
    }
  }

  renderTransactions() {
    let filteredTransactions = this.transactions;
    
    if (this.currentFilter !== 'all') {
      filteredTransactions = this.transactions.filter(t => t.type === this.currentFilter);
    }

    if (filteredTransactions.length === 0) {
      this.transactionList.innerHTML = `
        <div class="empty-state">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          <h4>${this.currentFilter === 'all' ? 'No transactions yet' : No ${this.currentFilter} transactions}</h4>
          <p>${this.currentFilter === 'all' ? 'Add your first transaction to get started' : No ${this.currentFilter} records found}</p>
        </div>
      `;
      return;
    }

    this.transactionList.innerHTML = filteredTransactions
      .map(transaction => `
        <div class="transaction-item ${transaction.type}">
          <div class="transaction-details">
            <div class="transaction-description">${transaction.description}</div>
            <div class="transaction-date">${transaction.date}</div>
          </div>
          <div class="transaction-amount ${transaction.type}">
            ${transaction.type === 'income' ? '+' : '-'}${this.formatCurrency(transaction.amount)}
          </div>
          <button class="delete-btn" onclick="budgetTracker.deleteTransaction(${transaction.id})">
            Delete
          </button>
        </div>
      `)
      .join('');
  }

  render() {
    this.renderStats();
    this.renderTransactions();
  }

  saveToStorage() {
    localStorage.setItem('budget-transactions', JSON.stringify(this.transactions));
  }

  showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = notification ${type};
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 100);
    
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
  }
}

// Initialize the budget tracker
const budgetTracker = new BudgetTracker();

// Add some sample data for demo (remove in production)
if (budgetTracker.transactions.length === 0) {
  const sampleData = [
    { id: 1, description: 'Salary Payment', amount: 150000, type: 'income', date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) },
    { id: 2, description: 'Grocery Shopping', amount: 15000, type: 'expense', date: new Date(Date.now() - 86400000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) },
    { id: 3, description: 'Freelance Project', amount: 45000, type: 'income', date: new Date(Date.now() - 172800000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) }
  ];
  
  // Uncomment below to add sample data
  // budgetTracker.transactions = sampleData;
  // budgetTracker.render();
}

const form = document.querySelector("form");
const description = document.querySelector("#description");
const amount = document.querySelector("#amount");
const type = document.querySelector("#type");
const incomeDisplay = document.querySelector("#income");
const expenseDisplay = document.querySelector("#expenses");
const balanceDisplay = document.querySelector("#balance");

let income = 0;
let expenses = 0;

form.addEventListener("submit", function(e) {
  e.preventDefault();

  const value = Number(amount.value);
  if (type.value === "Income") {
    income += value;
  } else {
    expenses += value;
  }

  balanceDisplay.innerText = ₦${income - expenses};
  incomeDisplay.innerText = ₦${income};
  expenseDisplay.innerText = ₦${expenses};
});
