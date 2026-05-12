// ===================================================
// dashboard.js — View do Painel Inicial
// ===================================================

function formatarMoeda(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatarData(dataString) {
    const dataObj = new Date(dataString);
    return new Date(dataObj.getTime() + dataObj.getTimezoneOffset() * 60000).toLocaleDateString('pt-BR');
}

// Essa função é chamada AUTOMATICAMENTE pelo data.js
function atualizarTela() {
    const saldoAtual = calcularSaldoTotal(); // Vem do data.js
    
    let entradas = 0;
    let saidas = 0;
    transacoes.forEach(t => {
        if (t.tipo === "receita") entradas += t.valor;
        else if (t.tipo === "despesa") saidas += t.valor;
    });

    document.querySelector('#display-saldo').innerText = formatarMoeda(saldoAtual);
    document.querySelector('#card-income').innerText = formatarMoeda(entradas);
    document.querySelector('#card-expense').innerText = formatarMoeda(saidas);

    const elSaldo = document.querySelector('#display-saldo');
    if(elSaldo) elSaldo.style.color = saldoAtual < 0 ? "#ef4444" : "";

    renderizarTabela();
    renderizarGrafico();

    // Sincroniza a página de transações se ela existir!
    if (typeof aplicarFiltrosNaPagina === 'function') {
        aplicarFiltrosNaPagina();
    }
}

function renderizarTabela() {
    const tbody = document.querySelector('#lista-transacoes');
    if (!tbody) return;
    tbody.innerHTML = "";

    const recentes = transacoes.slice(0, 5); // Pega só as 5 últimas pro painel

    if (recentes.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:2rem; color:#888;">Nenhuma transação cadastrada ainda.</td></tr>`;
        return;
    }

    recentes.forEach(function(t) {
        const isReceita = t.tipo === "receita";
        const cor = isReceita ? "#22c55e" : "#ef4444";
        const sinal = isReceita ? "+" : "-";
        const tr = document.createElement('tr');

        tr.innerHTML = `
            <td>${t.descricao}</td>
            <td style="text-transform: capitalize;">${t.categoria}</td>
            <td>${formatarData(t.data)}</td>
            <td style="color: ${cor}; font-weight: 600;">${sinal} ${formatarMoeda(t.valor)}</td>
            <td><button onclick="excluirTransacao(${t.id})" style="color:#ef4444; border:none; background:none; cursor:pointer; font-size: 1.1rem;">🗑</button></td>
        `;
        tbody.appendChild(tr);
    });
}

let graficoCategorias = null;

function renderizarGrafico() {
    const despesas = transacoes.filter(t => t.tipo === "despesa");
    const totais = {};
    
    despesas.forEach(t => {
        const cat = t.categoria ? t.categoria.toLowerCase() : 'outros';
        if (totais[cat]) totais[cat] += t.valor;
        else totais[cat] = t.valor;
    });

    const labels = Object.keys(totais).map(c => c.charAt(0).toUpperCase() + c.slice(1));
    const valores = Object.values(totais);

    if (graficoCategorias) graficoCategorias.destroy();
    
    const ctx = document.getElementById('grafico-categorias');
    if (!ctx || labels.length === 0) return;

    const pluginTotalCentro = {
        id: 'totalCentro',
        beforeDraw: function(chart) {
            const ctx = chart.ctx;
            const width = chart.width;
            const height = chart.height;
            const total = chart.data.datasets[0].data.reduce((a, b) => a + b, 0);

            ctx.restore();
            ctx.font = 'bold 14px Inter';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = '#1e293b';
            ctx.textAlign = 'center';
            ctx.fillText(formatarMoeda(total), width / 2, height / 2);
            ctx.save();
        }
    };

    graficoCategorias = new Chart(ctx, {
        type: 'doughnut',
        plugins: [pluginTotalCentro],
        data: {
            labels: labels,
            datasets: [{
                data: valores,
                backgroundColor: ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#3b82f6', '#ec4899', '#14b8a6']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            cutout: '70%',
            plugins: { legend: { position: 'bottom' } }
        }
    });
}

// ==========================================
// ROTEAMENTO SPA (Navegação do Menu Lateral)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const navButtons = document.querySelectorAll('.nav-btn');
    const pages = document.querySelectorAll('.page-content');

    if (navButtons.length === 0 || pages.length === 0) return;

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            navButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            pages.forEach(page => page.style.display = 'none');
            
            const targetId = button.getAttribute('data-target');
            const targetPage = document.getElementById(targetId);
            if (targetPage) targetPage.style.display = 'block';
        });
    });
});

// ==========================================
// LOGOUT
// ==========================================
const btnSair = document.getElementById('btn-sair');
if (btnSair) {
    btnSair.addEventListener('click', async () => {
        btnSair.textContent = 'Saindo...';
        localStorage.removeItem('manterConectado');
        await cliente_supabase.auth.signOut();
        window.location.href = 'login.html'; 
    });
}