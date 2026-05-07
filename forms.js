
const modalOverlay = document.querySelector('#modal-overlay');
const btnNovaTransacao = document.querySelector('.btn-nova-transacao');
const btnFecharModal = document.querySelector('#btn-fechar-modal');


const form = document.querySelector('#tx-form');
const inputDescricao = document.querySelector('#input-descricao');
const inputValor = document.querySelector('#input-valor');
const inputData = document.querySelector('#input-data');
const inputCategoria = document.querySelector('#input-categoria');
const inputRecorrente = document.querySelector('#input-recorrente');

const btnDespesa = document.querySelector('#btn-despesa');
const btnReceita = document.querySelector('#btn-receita');
let tipoAtual = 'despesa'; 


btnNovaTransacao.addEventListener('click', function() {
    modalOverlay.style.display = 'flex'; 
});

btnFecharModal.addEventListener('click', function() {
    modalOverlay.style.display = 'none'; 
});


btnDespesa.addEventListener('click', function() {
    btnDespesa.classList.add('ativo');    
    btnReceita.classList.remove('ativo'); 
    tipoAtual = 'despesa';
});

btnReceita.addEventListener('click', function() {
    btnReceita.classList.add('ativo');    
    btnDespesa.classList.remove('ativo'); 
    tipoAtual = 'receita';
});


form.addEventListener('submit', function(event) {
    event.preventDefault();


    if (inputDescricao.value.trim() === "" || inputValor.value.trim() === "" || inputData.value === "") {
        alert("Atenção: Por favor, preencha todos os campos obrigatórios da transação!");
        return;
    }


    const transaction = {
        description: inputDescricao.value,
        amount: Number(inputValor.value),
        date: inputData.value,
        category: inputCategoria.value,
        recurring: inputRecorrente.checked, 
        type: tipoAtual 
    };

    
    const currentData = JSON.parse(localStorage.getItem('transactions')) || [];
    currentData.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(currentData));

    console.log("Sucesso! Transação enviada:", transaction);

    
    form.reset();
    btnDespesa.classList.add('ativo');
    btnReceita.classList.remove('ativo');
    tipoAtual = 'despesa';
    
   
    modalOverlay.style.display = 'none';
    alert("Transação salva com sucesso!");
});