// ==========================================
// MÓDULO DE METAS (Com o visual exato da equipe)
// ==========================================

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

    container.innerHTML = ''; // Limpa a tela

    metas.forEach(meta => {
        // Cálculos matemáticos de progresso
        const porcentagem = meta.valor_alvo > 0 ? ((meta.valor_atual / meta.valor_alvo) * 100).toFixed(0) : 0;
        const valorFaltante = meta.valor_alvo - meta.valor_atual;

        // Formatação de Moeda (Padrão PT-BR)
        const formatarBRL = (valor) => valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

        const card = document.createElement('div');
        card.className = 'meta-card';
        
        // Aqui nós injetamos O SEU HTML exato, só trocando os dados
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

// Adiciona saldo a uma meta existente
async function adicionarAporte(idMeta, valorAtual) {
    const inputField = document.getElementById(`aporte-${idMeta}`);
    const valorAporte = parseFloat(inputField.value);

    // Validação de segurança
    if (isNaN(valorAporte) || valorAporte <= 0) {
        mostrarNotificacao('Digite um valor válido para adicionar.', 'erro');
        return;
    }

    const novoValorAtual = valorAtual + valorAporte;

    // Atualiza a linha específica no Supabase
    const { error } = await cliente_supabase
        .from('metas')
        .update({ valor_atual: novoValorAtual })
        .eq('id', idMeta)
        .eq('user_id', usuarioLogado.id); // Segurança extra

    if (error) {
        console.error("Erro ao atualizar meta:", error);
        mostrarNotificacao('Erro ao adicionar valor.', 'erro');
    } else {
        mostrarNotificacao('Valor adicionado à meta com sucesso!', 'sucesso');
        await carregarMetas(); // Recarrega a tela com a barrinha atualizada
    }
}

// Lógica MVP para criar uma nova meta rápido (sem precisar fazer modal agora)
document.getElementById('btn-nova-meta')?.addEventListener('click', async () => {
    const nome = prompt('Qual o nome da sua nova meta? (Ex: Reserva de Emergência)');
    if (!nome) return;
    
    const valorAlvo = parseFloat(prompt('Qual o valor total que você quer alcançar? (Ex: 5000)'));
    if (isNaN(valorAlvo) || valorAlvo <= 0) return;

    const { error } = await cliente_supabase.from('metas').insert([{
        user_id: usuarioLogado.id,
        nome: nome,
        valor_alvo: valorAlvo,
        valor_atual: 0
    }]);

    if (!error) {
        await carregarMetas();
    }
});