const modalOverlay = document.querySelector('#modal-overlay');
const btnNovaTransacao = document.querySelector('.btn-nova-transacao');
const btnFecharModal = document.querySelector('#btn-fechar-modal');
<<<<<<< HEAD
const formMensagem = document.querySelector('#form-mensagem');
=======

>>>>>>> main
const form = document.querySelector('#tx-form');
const inputDescricao = document.querySelector('#input-descricao');
const inputValor = document.querySelector('#input-valor');
const inputData = document.querySelector('#input-data');
<<<<<<< HEAD
=======

>>>>>>> main
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

<<<<<<< HEAD
function mostrarMensagem(texto, tipo) {
    formMensagem.textContent = texto;
    formMensagem.style.display = 'block';

    if (tipo === 'erro') {
        formMensagem.style.backgroundColor = '#fee2e2';
        formMensagem.style.color = '#ef4444';
    } else if (tipo === 'sucesso') {
        formMensagem.style.backgroundColor = '#d1fae5';
        formMensagem.style.color = '#059669';
    }

    setTimeout(function() {
        formMensagem.style.display = 'none';
    }, 3000);
}

=======
>>>>>>> main
btnReceita.addEventListener('click', function() {
    btnReceita.classList.add('ativo');    
    btnDespesa.classList.remove('ativo'); 
    tipoAtual = 'receita';
});

form.addEventListener('submit', async function(event) {
    event.preventDefault();

    if (inputDescricao.value.trim() === "" || inputValor.value.trim() === "" || inputData.value === "") {
        alert("Atenção: Por favor, preencha todos os campos obrigatórios da transação!");
        return;
    }

    // Usamos o .checked para pegar o Verdadeiro/Falso do checkbox
    await adicionarTransacao(
        inputDescricao.value, 
        Number(inputValor.value), 
        tipoAtual, 
        inputData.value,
        inputCategoria.value,
        inputRecorrente.checked
    );

    console.log("Sucesso! Transação enviada para o banco de dados.");
    
    form.reset();
    btnDespesa.classList.add('ativo');
    btnReceita.classList.remove('ativo');
    tipoAtual = 'despesa';
    
    modalOverlay.style.display = 'none';
});