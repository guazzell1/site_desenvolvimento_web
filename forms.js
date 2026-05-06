
const form = document.querySelector('#transaction-form');
const descriptionInput = document.querySelector('#description');
const amountInput = document.querySelector('#amount');
const dateInput = document.querySelector('#date');
const typeInput = document.querySelector('#type');


form.addEventListener('submit', function(event) {
  
    event.preventDefault(); 

    if (descriptionInput.value.trim() === "" || amountInput.value.trim() === "" || dateInput.value === "") {
        alert("Atenção: Por favor, preencha todos os campos da transação!");
        return; 
    }

 const transaction = {
        description: descriptionInput.value,
        amount: Number(amountInput.value), 
        date: dateInput.value,
        type: typeInput.value
    };

     
    const currentData = JSON.parse(localStorage.getItem('transactions')) || [];
    currentData.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(currentData));
    console.log("Dados salvos no LocalStorage!", transaction);

    form.reset(); 
    alert("Transação salva com sucesso!");
    
});

