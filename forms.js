
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