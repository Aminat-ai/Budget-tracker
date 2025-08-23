const budgetForm = document.querySelector("#budget-form");
const descriptionInput = document.querySelector("#description");
const amountInput = document.querySelector("#amount");
const budgetList = document.querySelector("#budget-list");
const totalAmount = document.querySelector("#total");

let total = 0;

budgetForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const description = descriptionInput.value.trim();
  const amount = parseFloat(amountInput.value);

  if (description && !isNaN(amount)) {
    const listItem = document.createElement("li");
    listItem.textContent = `description: ₦{amount.toFixed(2)}`;
    budgetList.appendChild(listItem);

    total += amount;
    totalAmount.textContent = `Total: ₦${total.toFixed(2)}`;

    descriptionInput.value = "";
    amountInput.value = "";
  }
});

