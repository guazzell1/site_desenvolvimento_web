
const modalOverlay = document.querySelector('#modal-overlay');
const btnNovaTransacao = document.querySelector('.btn-nova-transacao') || document.querySelector('#btn-abrir-modal');
const btnFecharModal = document.querySelector('#btn-fechar-modal');
const formMensagem = document.querySelector('#form-mensagem');
const form = document.querySelector('#tx-form');
const inputDescricao = document.querySelector('#input-descricao');
const inputValor = document.querySelector('#input-valor');
const inputData = document.querySelector('#input-data');
const inputCategoria = document.querySelector('#input-categoria');
const inputRecorrente = document.querySelector('#input-recorrente');
const btnDespesa = document.querySelector('#btn-despesa');
const btnReceita = document.querySelector('#btn-receita');
let tipoAtual = 'despesa'; 

function mostrarMensagem(texto, tipo) {
    if (!formMensagem) return; 
    
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

const categoriasDespesa = [
    { valor: 'moradia', texto: 'Moradia' },
    { valor: 'alimentacao', texto: 'Alimentação' },
    { valor: 'transporte', texto: 'Transporte' },
    { valor: 'lazer', texto: 'Lazer' },
    { valor: 'saude', texto: 'Saúde' },
    { valor: 'outros', texto: 'Outros' }
];

const categoriasReceita = [
    { valor: 'salario', texto: 'Salário' },
    { valor: 'freelance', texto: 'Freelance' },
    { valor: 'rendimentos', texto: 'Rendimentos' },
    { valor: 'vendas', texto: 'Vendas' },
    { valor: 'outros', texto: 'Outros' }
];

function atualizarCategorias(tipo) {
    if (!inputCategoria) return;
    inputCategoria.innerHTML = ''; 
    const lista = tipo === 'despesa' ? categoriasDespesa : categoriasReceita;

    lista.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.valor;
        option.textContent = cat.texto;
        inputCategoria.appendChild(option);
    });
}


function abrirModal() {
    modalOverlay.style.display = 'flex';
    atualizarCategorias(tipoAtual);
}

if (btnNovaTransacao) {
    btnNovaTransacao.addEventListener('click', abrirModal);
}

const btnFab = document.querySelector('#btn-fab-nova-transacao');
if (btnFab) {
    btnFab.addEventListener('click', abrirModal);
}

if (btnFecharModal) {
    btnFecharModal.addEventListener('click', function() {
        modalOverlay.style.display = 'none'; 
        if (formMensagem) formMensagem.style.display = 'none'; 
    });
}

if (btnDespesa && btnReceita) {
    btnDespesa.addEventListener('click', function() {
        btnDespesa.classList.add('ativo');    
        btnReceita.classList.remove('ativo'); 
        tipoAtual = 'despesa';
        atualizarCategorias('despesa'); 
    });

    btnReceita.addEventListener('click', function() {
        btnReceita.classList.add('ativo');    
        btnDespesa.classList.remove('ativo'); 
        tipoAtual = 'receita';
        atualizarCategorias('receita'); 
    });
}


if (form) {
    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        // Trava 1: Campos Vazios
        if (inputDescricao.value.trim() === "" || inputValor.value.trim() === "" || inputData.value === "") {
            mostrarMensagem("Atenção: Por favor, preencha todos os campos obrigatórios!", "erro");
            return;
        }

       
        if (Number(inputValor.value) <= 0) {
            mostrarMensagem("O valor da transação deve ser maior que zero!", "erro");
            return;
        }

        const btnSalvar = document.querySelector('#btn-salvar');
        const textoOriginal = btnSalvar.textContent;
        btnSalvar.textContent = 'Salvando...';
        btnSalvar.disabled = true;

        try {
            await adicionarTransacao(
                inputDescricao.value, 
                Number(inputValor.value), 
                tipoAtual, 
                inputData.value,
                inputCategoria.value,
                inputRecorrente.checked
            );

            mostrarMensagem("Transação salva com sucesso!", "sucesso");

            setTimeout(function() {
                form.reset();
                btnDespesa.classList.add('ativo');
                btnReceita.classList.remove('ativo');
                tipoAtual = 'despesa';
                atualizarCategorias('despesa');
                modalOverlay.style.display = 'none';
            }, 1500);

        } catch (error) {
            console.error(error);
            mostrarMensagem("Erro ao salvar a transação no banco de dados.", "erro");
        } finally {
            btnSalvar.textContent = textoOriginal;
            btnSalvar.disabled = false;
        }
    });
}