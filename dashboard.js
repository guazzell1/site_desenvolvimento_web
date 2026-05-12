// ===================================================
// dashboard.js — Renderização do DOM
// ===================================================

function calcularEntradaDoMes() {
    let total = 0;
    transacoes.forEach(function(t) {
        if (t.tipo === "receita") total += t.valor;
    });
    return total;
}

function calcularSaidaDoMes() {
    let total = 0;
    transacoes.forEach(function(t) {
        if (t.tipo === "despesa") total += t.valor;
    });
    return total;
}

function atualizarTela() {
    console.log("Recebi o aviso do data.js! Desenhando a tela...");

    const saldoAtual = calcularSaldoTotal(); 
    const entradas = calcularEntradaDoMes();
    const saídas = calcularSaidaDoMes();

    // 1. Injetando os valores nos IDs exatos do HTML do Aluno 1
    document.querySelector('#display-saldo').innerText = `R$ ${saldoAtual.toFixed(2)}`;
    document.querySelector('#card-income').innerText = `R$ ${entradas.toFixed(2)}`;
    document.querySelector('#card-expense').innerText = `R$ ${saídas.toFixed(2)}`;

    renderizarTabela();
}

function renderizarTabela() {
    // 2. Pegando o ID exato do <tbody>
    const tbody = document.querySelector('#lista-transacoes');
    tbody.innerHTML = ""; // Limpa a tabela

    console.log(`Renderizando ${transacoes.length} transações na tabela...`);

    transacoes.forEach(function(t) {
        const tr = document.createElement('tr');
        
        // A ordem das colunas no HTML é: Descrição, Categoria, Data, Valor, Ação
        tr.innerHTML = `
            <td>${t.descricao}</td>
            <td style="text-transform: capitalize;">${t.categoria}</td>
            <td>${t.data.split('-').reverse().join('/')}</td>
            <td>R$ ${t.valor.toFixed(2)}</td>
            <td><button onclick="excluirTransacao(${t.id})" style="color: red; border: none; background: none; cursor: pointer;">X</button></td>
        `;
        
        tbody.appendChild(tr);
    });
}

// ==========================================
// ROTEAMENTO SPA (Navegação do Menu Lateral)
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. Seleciona todos os botões do menu e todas as páginas
    const navButtons = document.querySelectorAll('.nav-btn');
    const pages = document.querySelectorAll('.page-content');

    // 2. Adiciona o evento de clique em cada botão
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            
            // Remove a classe 'active' de todos os botões
            navButtons.forEach(btn => btn.classList.remove('active'));
            
            // Adiciona a classe 'active' apenas no botão clicado
            button.classList.add('active');

            // Esconde todas as páginas
            pages.forEach(page => {
                page.style.display = 'none';
            });

            // Descobre qual página abrir lendo o "data-target" do botão
            const targetId = button.getAttribute('data-target');
            const targetPage = document.getElementById(targetId);
            
            // Mostra a página correta
            if (targetPage) {
                targetPage.style.display = 'block';
            }
        });
    });
});