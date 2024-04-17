function renderList() {
    list.innerHTML = "";

    status.textContent = "";
    if (transactions.length === 0) {
        status.textContent = "No transactions.";
        return;
    }

    transactions.forEach(({ id, name, amount, date, type }) => {
        const sign = "income" === type ? 1 : -1;

        const li = document.createElement("li");

        li.innerHTML = `
        <div class="name">
            <h4>${name}</h4>
            <p>${date.toLocaleDateString()}</p>
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

        list.appendChild(li);
    });
}
