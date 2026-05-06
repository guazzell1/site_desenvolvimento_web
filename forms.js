
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

  
});