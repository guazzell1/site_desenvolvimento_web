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
    renderizarGraficoLinha(); 
    renderizarMetasDashboard(); 

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

    // Mapa de ícones por categoria
    const icones = {
        moradia: '🏠',
        alimentacao: '🛒',
        transporte: '🚗',
        lazer: '🎮',
        saude: '💊',
        outros: '💰'
    };

    recentes.forEach(function(t) {
        const isReceita = t.tipo === "receita";
        const cor = isReceita ? "#22c55e" : "#ef4444";
        const sinal = isReceita ? "+" : "-";
        const icone = isReceita ? '💵' : (icones[t.categoria] || '💰');
        const tr = document.createElement('tr');

        tr.innerHTML = `
            <td>
                <div style="display:flex; align-items:center; gap:12px;">
                    <div style="width:40px; height:40px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:1.2rem; background-color:${isReceita ? '#dcfce7' : '#fee2e2'};">
                        ${icone}
                    </div>
                    <div>
                        <p style="font-weight:700; color:#0f172a; margin:0;">${t.descricao}</p>
                        <p style="font-size:0.8rem; color:#64748b; margin:0; text-transform:capitalize;">${t.categoria} • ${formatarData(t.data)}</p>
                    </div>
                </div>
            </td>
            <td style="display:none;">${t.categoria}</td>
            <td style="display:none;">${formatarData(t.data)}</td>
            <td style="color:${cor}; font-weight:700;">${sinal} ${formatarMoeda(t.valor)}</td>
            <td><button onclick="excluirTransacao(${t.id})" style="color:#ef4444; border:none; background:none; cursor:pointer; font-size:1.1rem;">🗑</button></td>
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

    const totalGeral = Object.values(totais).reduce((a, b) => a + b, 0);

    const labels = Object.keys(totais).map(function(c) {
        const pct = Math.round((totais[c] / totalGeral) * 100);
        return c.charAt(0).toUpperCase() + c.slice(1) + ' (' + pct + '%)';
    });
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

let graficoFluxo = null;

function renderizarGraficoLinha() {
  const ctx = document.getElementById('grafico-fluxo');
  if (!ctx) return;

  // Agrupa entradas e saídas por mês
  // ex: { "2026-05": { entradas: 6000, saidas: 370 } }
  const porMes = {};

  transacoes.forEach(function(t) {
    const mes = t.data.substring(0, 7); // pega "2026-05" de "2026-05-01"
    if (!porMes[mes]) {
      porMes[mes] = { entradas: 0, saidas: 0 };
    }
    if (t.tipo === "receita") {
      porMes[mes].entradas += t.valor;
    } else {
      porMes[mes].saidas += t.valor;
    }
  });

  // Ordena os meses cronologicamente
  const meses = Object.keys(porMes).sort();

  // Formata os meses para exibição ex: "2026-05" → "Mai/26"
  const nomesMeses = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
  const labels = meses.map(function(m) {
    const partes = m.split("-");
    return nomesMeses[parseInt(partes[1]) - 1] + "/" + partes[0].substring(2);
  });

  const dadosEntradas = meses.map(function(m) { return porMes[m].entradas; });
  const dadosSaidas   = meses.map(function(m) { return porMes[m].saidas; });

  if (graficoFluxo) graficoFluxo.destroy();

  graficoFluxo = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Entradas',
          data: dadosEntradas,
          borderColor: '#00d09c',
          backgroundColor: 'rgba(0, 208, 156, 0.1)',
          fill: true,
          tension: 0.4, // curva suave igual à referência
          borderWidth: 3
        },
        {
          label: 'Saídas',
          data: dadosSaidas,
          borderColor: '#ef4444',
          borderDash: [5, 5], // linha tracejada igual à referência
          backgroundColor: 'transparent',
          fill: false,
          tension: 0.4,
          borderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top' }
      },
      scales: {
        y: {
          ticks: {
            callback: function(value) {
              return 'R$ ' + value.toLocaleString('pt-BR');
            }
          }
        }
      }
    }
  });
}

async function renderizarMetasDashboard() {
  const container = document.getElementById('dashboard-metas');
  if (!container) return;
  if (!usuarioLogado) return;

  // Busca as metas do banco de dados
  const { data: metas, error } = await cliente_supabase
    .from('metas')
    .select('*')
    .eq('user_id', usuarioLogado.id)
    .order('created_at', { ascending: false })
    .limit(3); // mostra só as 3 primeiras no dashboard

  if (error || !metas || metas.length === 0) {
    container.innerHTML = `
      <p style="text-align:center; color:#94a3b8; font-size:0.875rem; padding: 1rem;">
        Nenhuma meta cadastrada ainda.
      </p>
    `;
    return;
  }

  container.innerHTML = "";

  metas.forEach(function(meta) {
    const pct = meta.valor_alvo > 0
      ? Math.min(Math.round((meta.valor_atual / meta.valor_alvo) * 100), 100)
      : 0;

    const div = document.createElement('div');
    div.style.marginBottom = '16px';

    div.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
        <p style="font-size:0.875rem; font-weight:600; color:#0f172a; margin:0;">${meta.nome}</p>
        <span style="font-size:0.75rem; font-weight:700; color:#00d09c;">${pct}%</span>
      </div>
      <p style="font-size:0.75rem; color:#94a3b8; margin:0 0 6px 0;">
        Meta: R$ ${meta.valor_alvo.toLocaleString('pt-BR', {minimumFractionDigits:2})}
      </p>
      <div style="width:100%; height:6px; background:#f1f5f9; border-radius:999px; overflow:hidden;">
        <div style="height:100%; width:${pct}%; background:#00d09c; border-radius:999px;"></div>
      </div>
    `;

    container.appendChild(div);
  });
}