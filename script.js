const form = document.getElementById('transaction-form');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const transactionList = document.getElementById('transaction-list');
const totalDisplay = document.getElementById('total');

let transactions = [];

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const description = descriptionInput.value.trim();
  const amount = parseFloat(amountInput.value.trim());

  if (!description || isNaN(amount)) return;

  const transaction = {
    id: Date.now(),
    description,
    amount
  };

  transactions.push(transaction);
  updateUI();
  form.reset();
});

  transactionList.innerHTML = '';
  let total = 0;

  transactions.forEach(tran => {
    const li = document.createElement('li');
    li.textContent = tran.description: ₦{tran.amount.toFixed(2)};

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'X';
    deleteBtn.onclick = () => deleteTransaction(tran.id);

    li.appendChild(deleteBtn);
    transactionList.appendChild(li);

    total += tran.amount;
  });

  totalDisplay.textContent = total.toFixed(2);
}
function deleteTransaction(id) {
  transactions = transactions.filter(tran => tran.id !== id);
  updateUI();
}