// ==========================================
// transacoes.js - View da aba Histórico
// ==========================================

function aplicarFiltrosNaPagina() {
    const termoBusca = document.getElementById('filtro-busca')?.value.toLowerCase().trim() || "";
    const categoriaSelecionada = document.getElementById('filtro-categoria')?.value || "";
    const tipoSelecionado = document.getElementById('filtro-tipo')?.value || "";

    // Usa o array global 'transacoes' que veio do data.js!
    const transacoesFiltradas = transacoes.filter(tx => {
        const bateBusca = tx.descricao.toLowerCase().includes(termoBusca);
        const bateCategoria = categoriaSelecionada === "" || tx.categoria === categoriaSelecionada;
        const bateTipo = tipoSelecionado === "" || tx.tipo === tipoSelecionado;
        return bateBusca && bateCategoria && bateTipo;
    });

    renderizarCardsTransacoes(transacoesFiltradas);
}

function renderizarCardsTransacoes(lista) {
    const container = document.getElementById('grid-transacoes-pagina');
    if (!container) return;

    container.innerHTML = '';

    if (!lista || lista.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 48px 24px; background-color: #ffffff; border: 2px dashed #e2e8f0; border-radius: 16px; margin-top: 16px;">
                <div style="font-size: 2rem; margin-bottom: 16px;">🔍</div>
                <h4 style="color: #0f172a; font-size: 1.15rem; font-weight: 700;">Nenhum resultado</h4>
                <p style="color: #64748b; font-size: 0.95rem;">Tente mudar os filtros ou a busca.</p>
            </div>
        `;
        return;
    }

    const iconesFina = {
        'moradia': 'home',
        'alimentacao': 'restaurant',
        'transporte': 'directions_car',
        'lazer': 'theater_comedy',
        'saude': 'medical_services',
        'salario': 'payments',
        'outros': 'category'
    };

    lista.forEach(tx => {
        const isDespesa = tx.tipo === 'despesa';
        const corClasse = isDespesa ? 'expense' : 'income';
        const sinal = isDespesa ? '-' : '+';
        const nomeIcone = iconesFina[tx.categoria?.toLowerCase()] || 'sell';
        
        const valorFormatado = parseFloat(tx.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        
        const dataObj = new Date(tx.data);
        const dataFormatada = new Date(dataObj.getTime() + dataObj.getTimezoneOffset() * 60000).toLocaleDateString('pt-BR');

        const card = document.createElement('div');
        card.className = 'tx-card';
        
        card.innerHTML = `
            <div class="tx-info-left">
                <div class="tx-icon ${corClasse}">
                    <span class="material-symbols-outlined">${nomeIcone}</span>
                </div>
                <div>
                    <p class="tx-title">${tx.descricao}</p>
                    <p class="tx-desc">${tx.categoria || 'Geral'} • ${dataFormatada}</p>
                </div>
            </div>
            <div class="tx-info-right">
                <p class="tx-value ${corClasse}">${sinal} R$ ${valorFormatado}</p>
                <!-- Usa a função excluirTransacao que já existe no seu data.js! -->
                <p class="tx-method" onclick="excluirTransacao('${tx.id}')">🗑️ Excluir</p>
            </div>
        `;
        container.appendChild(card);
    });
}

// Ouve os filtros em tempo real
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('filtro-busca')?.addEventListener('input', aplicarFiltrosNaPagina);
    document.getElementById('filtro-categoria')?.addEventListener('change', aplicarFiltrosNaPagina);
    document.getElementById('filtro-tipo')?.addEventListener('change', aplicarFiltrosNaPagina);
});