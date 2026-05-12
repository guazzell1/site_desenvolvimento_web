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
            <!-- Cabeçalho do Card -->
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
                <div style="display: flex; gap: 12px; align-items: center;">
                    <!-- Ícone Decorativo (Opcional) -->
                    <div style="width: 40px; height: 40px; border-radius: 10px; background-color: rgba(0, 208, 156, 0.1); display: flex; align-items: center; justify-content: center; font-size: 1.2rem;">
                        🎯
                    </div>
                    <div>
                        <h4 style="font-weight: 700; font-size: 1.05rem; color: #0f172a; margin: 0;">${meta.nome}</h4>
                        <p style="font-size: 0.75rem; color: #64748b; margin-top: 2px;">Meta de Poupança</p>
                    </div>
                </div>
                <button class="btn-remover-meta" onclick="excluirMeta('${meta.id}')" style="background: none; border: none; color: #94a3b8; cursor: pointer; font-size: 1.2rem; transition: color 0.2s;" onmouseover="this.style.color='#ef4444'" onmouseout="this.style.color='#94a3b8'">🗑</button>
            </div>

            <!-- Valores e Barra de Progresso Fina -->
            <div style="display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px;">
                <div style="display: flex; justify-content: space-between; align-items: flex-end;">
                    <span style="font-size: 0.875rem; font-weight: 700; color: #0f172a;">
                        R$ ${formatarBRL(meta.valor_atual)} 
                        <span style="color: #94a3b8; font-weight: 400; font-size: 0.75rem;">de R$ ${formatarBRL(meta.valor_alvo)}</span>
                    </span>
                    <span style="color: #00d09c; font-weight: 900; font-size: 0.875rem;">${porcentagem}%</span>
                </div>
                
                <!-- Barra (Mais fina e arredondada) -->
                <div style="width: 100%; height: 8px; background-color: #f1f5f9; border-radius: 999px; overflow: hidden;">
                    <div style="height: 100%; background-color: #00d09c; border-radius: 999px; width: ${porcentagem > 100 ? 100 : porcentagem}%; transition: width 0.5s ease;"></div>
                </div>
            </div>

            <!-- Input Compacto de Aporte -->
            <div style="display: flex; gap: 8px; border-top: 1px dashed #e2e8f0; padding-top: 12px;">
                <input type="number" id="aporte-${meta.id}" placeholder="Adicionar R$" step="0.01" style="flex: 1; padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 0.875rem; outline: none;">
                <button onclick="adicionarAporte('${meta.id}', ${meta.valor_atual})" style="background-color: #00d09c; color: white; border: none; border-radius: 8px; padding: 0 16px; font-weight: 600; font-size: 0.875rem; cursor: pointer; transition: background-color 0.2s;" onmouseover="this.style.backgroundColor='#00a67c'" onmouseout="this.style.backgroundColor='#00d09c'">+ Salvar</button>
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