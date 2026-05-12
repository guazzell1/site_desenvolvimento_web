// ==========================================
// MÓDULO DE METAS - CRUD Completo
// ==========================================

// 1. CARREGAR E RENDERIZAR METAS
async function carregarMetas() {
    if (!usuarioLogado) return;

    const { data: metas, error } = await cliente_supabase
        .from('metas')
        .select('*')
        .eq('user_id', usuarioLogado.id)
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Erro ao carregar metas:", error);
        return;
    }

    renderizarMetas(metas);
}

function renderizarMetas(metas) {
    const container = document.getElementById('grid-de-metas');
    const displayTotal = document.getElementById('display-total-economizado'); // Pega o h2 da esquerda
    if (!container) return;

    container.innerHTML = ''; 
    let totalAcumulado = 0; // Nasce a variável do somatório

    metas.forEach(meta => {
        // Soma o dinheiro guardado nesta meta ao montante geral
        totalAcumulado += parseFloat(meta.valor_atual) || 0;

        const porcentagem = meta.valor_alvo > 0 ? ((meta.valor_atual / meta.valor_alvo) * 100).toFixed(0) : 0;
        const valorFaltante = meta.valor_alvo - meta.valor_atual;
        const formatarBRL = (valor) => valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

        const card = document.createElement('div');
        card.className = 'meta-card';
        
        card.innerHTML = `
            <div class="meta-card-header">
                <span class="meta-nome">${meta.nome}</span>
                <button class="btn-remover-meta" onclick="excluirMeta('${meta.id}')">🗑</button>
            </div>
            <div>
                <p class="meta-valor-atual">R$ ${formatarBRL(meta.valor_atual)}</p>
                <p class="meta-de">de R$ ${formatarBRL(meta.valor_alvo)}</p>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin: 12px 0;">
                <div class="progress-bar" style="flex: 1;">
                    <div class="progress-fill" style="width: ${porcentagem > 100 ? 100 : porcentagem}%;"></div>
                </div>
                <span class="meta-pct" style="margin-left: 12px;">${porcentagem}%</span>
            </div>
            <p class="meta-faltam">Faltam R$ ${formatarBRL(valorFaltante)}</p>
            <div class="meta-input-row" style="margin-top: 12px;">
                <input type="number" id="aporte-${meta.id}" placeholder="R$ 0,00" step="0.01">
                <button class="btn-adicionar-meta" onclick="adicionarAporte('${meta.id}', ${meta.valor_atual})">+ Adicionar</button>
            </div>
        `;
        
        container.appendChild(card);
    });

    // Atualiza o visor da esquerda com o total
    if (displayTotal) {
        displayTotal.textContent = `R$ ${totalAcumulado.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
}

// 2. APORTAR DINHEIRO (UPDATE)
window.adicionarAporte = async function(idMeta, valorAtual) {
    const inputField = document.getElementById(`aporte-${idMeta}`);
    const valorAporte = parseFloat(inputField.value);

    if (isNaN(valorAporte) || valorAporte <= 0) {
        alert('Digite um valor válido para adicionar.'); // Pode trocar pelo seu Toast
        return;
    }

    const novoValorAtual = valorAtual + valorAporte;

    const { error } = await cliente_supabase
        .from('metas')
        .update({ valor_atual: novoValorAtual })
        .eq('id', idMeta)
        .eq('user_id', usuarioLogado.id);

    if (!error) {
        inputField.value = ''; // Limpa o input
        await carregarMetas(); // Recarrega a tela
    } else {
        console.error("Erro ao adicionar aporte:", error);
    }
}

// 3. DELETAR META (DELETE)
window.excluirMeta = async function(idMeta) {
    if (!confirm('Tem certeza que deseja excluir esta meta?')) return;

    const { error } = await cliente_supabase
        .from('metas')
        .delete()
        .eq('id', idMeta)
        .eq('user_id', usuarioLogado.id);

    if (!error) {
        await carregarMetas();
    } else {
        console.error("Erro ao excluir meta:", error);
    }
}

// 4. LÓGICA DO FORMULÁRIO LATERAL (INSERT)
document.addEventListener('DOMContentLoaded', () => {
    const formMetaInline = document.getElementById('form-nova-meta-inline');

    if (formMetaInline) {
        formMetaInline.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const nome = document.getElementById('input-meta-nome-inline').value.trim();
            const valorAlvo = parseFloat(document.getElementById('input-meta-valor-inline').value);

            if (!usuarioLogado) return;

            const { error } = await cliente_supabase.from('metas').insert([{
                user_id: usuarioLogado.id,
                nome: nome,
                valor_alvo: valorAlvo,
                valor_atual: 0
            }]);

            if (!error) {
                formMetaInline.reset(); // Limpa os campos após salvar
                await carregarMetas(); // Renderiza o novo card instantaneamente
            } else {
                console.error("Erro ao criar meta:", error);
            }
        });
    }
});