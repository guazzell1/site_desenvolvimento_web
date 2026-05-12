// ===================================================
// dashboard.js — Renderização do DOM
// ===================================================

function formatarMoeda(valor) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function formatarData(dataString) {
  return dataString.split('-').reverse().join('/');
}

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
  const saldoAtual = calcularSaldoTotal();
  const entradas   = calcularEntradaDoMes();
  const saidas     = calcularSaidaDoMes();

  document.querySelector('#display-saldo').innerText = formatarMoeda(saldoAtual);
  document.querySelector('#card-income').innerText   = formatarMoeda(entradas);
  document.querySelector('#card-expense').innerText  = formatarMoeda(saidas);

  const elSaldo = document.querySelector('#display-saldo');
  elSaldo.style.color = saldoAtual < 0 ? "#ef4444" : "";

  renderizarTabela();
  renderizarGrafico();
}

function renderizarTabela() {
  const tbody         = document.querySelector('#lista-transacoes');
  const tbodyCompleta = document.querySelector('#lista-transacoes-completa');

  tbody.innerHTML         = "";
  tbodyCompleta.innerHTML = "";

  if (transacoes.length === 0) {
    const msgVazia = `
      <tr>
        <td colspan="5" style="text-align:center; padding:2rem; color:#888;">
          Nenhuma transação cadastrada ainda.
        </td>
      </tr>
    `;
    tbody.innerHTML         = msgVazia;
    tbodyCompleta.innerHTML = msgVazia;
    return;
  }

  transacoes.forEach(function(t) {
    const tr = document.createElement('tr');

    const isReceita = t.tipo === "receita";
    const cor       = isReceita ? "#22c55e" : "#ef4444";
    const sinal     = isReceita ? "+" : "-";

    tr.innerHTML = `
      <td>${t.descricao}</td>
      <td style="text-transform: capitalize;">${t.categoria}</td>
      <td>${formatarData(t.data)}</td>
      <td style="color: ${cor}; font-weight: 600;">${sinal} ${formatarMoeda(t.valor)}</td>
      <td><button onclick="excluirTransacao(${t.id})" style="color:#ef4444; border:none; background:none; cursor:pointer;">🗑</button></td>
    `;

    tbody.appendChild(tr.cloneNode(true));
    tbodyCompleta.appendChild(tr);
  });
}

let graficoCategorias = null;

function renderizarGrafico() {
  const despesas = transacoes.filter(function(t) {
    return t.tipo === "despesa";
  });

  const totais = {};
  despesas.forEach(function(t) {
    if (totais[t.categoria]) {
      totais[t.categoria] += t.valor;
    } else {
      totais[t.categoria] = t.valor;
    }
  });

  const labels  = Object.keys(totais);
  const valores = Object.values(totais);

  if (labels.length === 0) return;

  if (graficoCategorias) {
    graficoCategorias.destroy();
  }

  const ctx = document.getElementById('grafico-categorias');
  if (!ctx) return;

  // Plugin que desenha o total no centro do gráfico
  const pluginTotalCentro = {
    id: 'totalCentro',
    beforeDraw: function(chart) {
      const ctx = chart.ctx;
      const width = chart.width;
      const height = chart.height;

      // Soma todos os valores para mostrar o total
      const total = chart.data.datasets[0].data.reduce(function(a, b) {
        return a + b;
      }, 0);

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
        backgroundColor: [
          '#6366f1', '#22c55e', '#f59e0b',
          '#ef4444', '#3b82f6', '#ec4899'
        ]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      cutout: '70%',
      plugins: {
        legend: { position: 'bottom' }
      }
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
            // 1. Remove a classe 'active' de todos os botões
            navButtons.forEach(btn => btn.classList.remove('active'));
            
            // 2. Adiciona a classe 'active' no botão clicado
            button.classList.add('active');

            // 3. Esconde todas as páginas
            pages.forEach(page => {
                page.style.display = 'none';
            });

            // 4. Mostra a página alvo correta
            const targetId = button.getAttribute('data-target');
            const targetPage = document.getElementById(targetId);
            
            if (targetPage) {
                targetPage.style.display = 'block'; // Mostra a página nova
            }
        });
    });
});

// ==========================================
// LOGOUT (Sair da Conta)
// ==========================================
const btnSair = document.getElementById('btn-sair');

if (btnSair) {
    btnSair.addEventListener('click', async () => {
        // Feedback visual
        const textoOriginal = btnSair.textContent;
        btnSair.textContent = 'Saindo...';
        
        // Esquece a preferência do usuário
        localStorage.removeItem('manterConectado');
        
        // Pede pro Supabase encerrar a sessão
        const { error } = await cliente_supabase.auth.signOut();
        
        if (error) {
            console.error("Erro ao fazer logout:", error);
            alert("Erro ao sair da conta.");
            btnSair.textContent = textoOriginal;
        } else {
            // Sessão limpa! Manda de volta para a tela de login
            window.location.href = 'login.html'; // Se você salvou como auth.html, mude o nome aqui!
        }
    });
}