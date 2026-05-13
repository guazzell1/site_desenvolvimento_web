// ==========================================
// transacoes.js - View da aba Histórico
// ==========================================

function aplicarFiltrosNaPagina() {
    const termoBusca = document.getElementById('filtro-busca')?.value.toLowerCase().trim() || "";
    const categoriaSelecionada = document.getElementById('filtro-categoria')?.value || "";
    const tipoSelecionado = document.getElementById('filtro-tipo')?.value || "";
    const mesSelecionado = document.getElementById('filtro-mes')?.value || "";

    const transacoesFiltradas = transacoes.filter(tx => {
        const bateBusca = tx.descricao.toLowerCase().includes(termoBusca);
        const bateCategoria = categoriaSelecionada === "" || tx.categoria === categoriaSelecionada;
        const bateTipo = tipoSelecionado === "" || tx.tipo === tipoSelecionado;
        const bateMes = mesSelecionado === "" || tx.data.substring(0, 7) === mesSelecionado;
        return bateBusca && bateCategoria && bateTipo && bateMes;
    });

    renderizarCardsTransacoes(transacoesFiltradas);
}

function renderizarCardsTransacoes(lista) {
    const container = document.getElementById('grid-transacoes-pagina');
    if (!container) return;
    container.innerHTML = '';

    if (!lista || lista.length === 0) {
        container.innerHTML = `
            <div style="text-align:center; padding:48px 24px; background:#fff; border:2px dashed #e2e8f0; border-radius:16px; margin-top:16px;">
                <div style="font-size:2rem; margin-bottom:16px;">🔍</div>
                <h4 style="color:#0f172a; font-size:1.15rem; font-weight:700;">Nenhum resultado</h4>
                <p style="color:#64748b; font-size:0.95rem;">Tente mudar os filtros ou a busca.</p>
            </div>
        `;
        return;
    }

    const ordenadas = [...lista].sort(function(a, b) {
        return new Date(b.data) - new Date(a.data);
    });

    const porDia = {};
    ordenadas.forEach(function(tx) {
        const dia = tx.data.substring(0, 10); // "2026-05-12"
        if (!porDia[dia]) porDia[dia] = [];
        porDia[dia].push(tx);
    });

    const iconesFina = {
        'moradia': 'home',
        'alimentacao': 'restaurant',
        'transporte': 'directions_car',
        'lazer': 'theater_comedy',
        'saude': 'medical_services',
        'salario': 'payments',
        'outros': 'category'
    };

    const nomesMeses = ["janeiro","fevereiro","março","abril","maio","junho",
                        "julho","agosto","setembro","outubro","novembro","dezembro"];

    Object.keys(porDia).forEach(function(dia) {
        const txsDoDia = porDia[dia];

        const dataObj = new Date(dia + 'T12:00:00');
        const hoje = new Date();
        const ontem = new Date();
        ontem.setDate(ontem.getDate() - 1);

        let labelDia = '';
        if (dataObj.toDateString() === hoje.toDateString()) {
            labelDia = 'Hoje';
        } else if (dataObj.toDateString() === ontem.toDateString()) {
            labelDia = 'Ontem';
        } else {
            labelDia = dataObj.getDate() + ' de ' + nomesMeses[dataObj.getMonth()] + ' de ' + dataObj.getFullYear();
        }

        const header = document.createElement('div');
        header.style.cssText = 'padding: 16px 0 8px 0; font-weight:700; font-size:1rem; color:#0f172a;';
        header.textContent = labelDia;
        container.appendChild(header);

        txsDoDia.forEach(function(tx) {
            const isDespesa = tx.tipo === 'despesa';
            const corClasse = isDespesa ? 'expense' : 'income';
            const sinal = isDespesa ? '-' : '+';
            const nomeIcone = iconesFina[tx.categoria?.toLowerCase()] || 'sell';
            const valorFormatado = parseFloat(tx.valor).toLocaleString('pt-BR', {
                minimumFractionDigits: 2, maximumFractionDigits: 2
            });

            const card = document.createElement('div');
            card.className = 'tx-card';

            card.innerHTML = `
                <div class="tx-info-left">
                    <div class="tx-icon ${corClasse}">
                        <span class="material-symbols-outlined">${nomeIcone}</span>
                    </div>
                    <div>
                        <p class="tx-title">${tx.descricao}</p>
                        <p class="tx-desc">${tx.categoria || 'Geral'}</p>
                    </div>
                </div>
                <div class="tx-info-right">
                    <p class="tx-value ${corClasse}">${sinal} R$ ${valorFormatado}</p>
                    <p class="tx-method" onclick="excluirTransacao('${tx.id}')">🗑️ Excluir</p>
                </div>
            `;
            container.appendChild(card);
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('filtro-busca')?.addEventListener('input', aplicarFiltrosNaPagina);
    document.getElementById('filtro-categoria')?.addEventListener('change', aplicarFiltrosNaPagina);
    document.getElementById('filtro-tipo')?.addEventListener('change', aplicarFiltrosNaPagina);
    document.getElementById('filtro-mes')?.addEventListener('change', aplicarFiltrosNaPagina);
});