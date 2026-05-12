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
    if (!container) return;

    container.innerHTML = ''; 

    metas.forEach(meta => {
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
                <p class="meta-valor-atual" style="color: #3b82f6;">R$ ${formatarBRL(meta.valor_atual)}</p>
                <p class="meta-de">de R$ ${formatarBRL(meta.valor_alvo)}</p>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div class="progress-bar" style="flex: 1;">
                    <div class="progress-fill" style="width: ${porcentagem > 100 ? 100 : porcentagem}%; background-color: #3b82f6;"></div>
                </div>
                <span class="meta-pct" style="margin-left: 12px;">${porcentagem}%</span>
            </div>
            <p class="meta-faltam">Faltam R$ ${formatarBRL(valorFaltante)}</p>
            <div class="meta-input-row">
                <input type="number" id="aporte-${meta.id}" placeholder="R$ 0,00" step="0.01">
                <button class="btn-adicionar-meta" style="background-color: #3b82f6;" onclick="adicionarAporte('${meta.id}', ${meta.valor_atual})">+ Adicionar</button>
            </div>
        `;
        
        container.appendChild(card);
    });
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

// 4. LÓGICA DO MODAL (INSERT)
document.addEventListener('DOMContentLoaded', () => {
    const btnNovaMeta = document.getElementById('btn-nova-meta');
    const modalMeta = document.getElementById('modal-meta-overlay');
    const btnFecharMeta = document.getElementById('btn-fechar-modal-meta');
    const formMeta = document.getElementById('form-nova-meta');

    // Abrir Modal
    if (btnNovaMeta && modalMeta) {
        btnNovaMeta.addEventListener('click', () => {
            modalMeta.style.display = 'flex';
        });
    }

    // Fechar Modal
    if (btnFecharMeta && modalMeta) {
        btnFecharMeta.addEventListener('click', () => {
            modalMeta.style.display = 'none';
        });
    }

    // Enviar Formulário (Salvar no Banco)
    if (formMeta) {
        formMeta.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const nome = document.getElementById('input-meta-nome').value;
            const valorAlvo = parseFloat(document.getElementById('input-meta-valor').value);

            if (!usuarioLogado) return;

            const { error } = await cliente_supabase.from('metas').insert([{
                user_id: usuarioLogado.id,
                nome: nome,
                valor_alvo: valorAlvo,
                valor_atual: 0
            }]);

            if (!error) {
                modalMeta.style.display = 'none'; // Fecha o modal
                formMeta.reset(); // Limpa o formulário
                await carregarMetas(); // Renderiza a nova meta na tela
            } else {
                console.error("Erro ao criar meta:", error);
            }
        });
    }
});