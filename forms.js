// Selecionando os elementos do SEU modal
const form = document.querySelector('#transaction-form');
const descriptionInput = document.querySelector('#description');
const amountInput = document.querySelector('#amount');
const dateInput = document.querySelector('#date');
const typeInput = document.querySelector('#type');

// Capturando o clique no botão de salvar
form.addEventListener('submit', function(event) {
    event.preventDefault(); // Impede a página de recarregar
    console.log("Botão clicado! Iniciando processo...");
});