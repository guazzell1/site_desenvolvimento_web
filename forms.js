
const modalOverlay = document.querySelector('#modal-overlay');
const btnNovaTransacao = document.querySelector('#btn-abrir-modal'); 
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


if (btnNovaTransacao) {
    btnNovaTransacao.addEventListener('click', function() {
        modalOverlay.style.display = 'flex'; 
    });
}

if (btnFecharModal) {
    btnFecharModal.addEventListener('click', function() {
        modalOverlay.style.display = 'none'; 
        formMensagem.style.display = 'none';
    });
}

if (btnDespesa && btnReceita) {
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
}


if (form) {
    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        
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