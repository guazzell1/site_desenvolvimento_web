// ==========================================
// data.js - Lógica e Dados Protegidos
// ==========================================

// O cliente_supabase agora vem do arquivo de configuração centralizado
let transacoes = [];
let usuarioLogado = null;

/**
 * PROTEÇÃO DE ROTA (Gatekeeper)
 * Verifica se existe um usuário logado antes de liberar o Dashboard.
 */
async function verificarSessao() {
    const { data: { session }, error } = await cliente_supabase.auth.getSession();

    if (error || !session) {
        console.warn("Acesso negado. Redirecionando para o cadastro...");
        window.location.replace('cadastro.html'); 
        return false;
    }

    usuarioLogado = session.user;
    console.log("Usuário autenticado:", usuarioLogado.email);
    return true;
}

/**
 * BUSCA SEGURA
 * Traz apenas as transações vinculadas ao UUID do usuário logado.
 */
async function carregarTransacoes() {
    if (!usuarioLogado) return;

    console.log(`[Segurança] Buscando dados para o ID: ${usuarioLogado.id}`);
    
    const { data, error } = await cliente_supabase
        .from('transacoes')
        .select('*')
        .eq('user_id', usuarioLogado.id); // 🔒 Filtro Crítico

    if (error) {
        console.error("Erro ao buscar dados:", error);
        return;
    }

    transacoes = data;
    
    if (typeof atualizarTela === "function") {
        atualizarTela(); 
    }
}

/**
 * INSERÇÃO VINCULADA
 * Adiciona a transação já "carimbada" com o ID do dono.
 */
async function adicionarTransacao(textoDescricao, numeroValor, textoTipo, textoData, textoCategoria, booleanoRecorrente) {
    if (!usuarioLogado) return;

    const novaTransacao = {
        descricao: textoDescricao,
        valor: numeroValor,
        tipo: textoTipo,
        data: textoData,
        categoria: textoCategoria,
        recorrente: booleanoRecorrente,
        user_id: usuarioLogado.id // 🔗 Amarração com o dono
    };

    const { data, error } = await cliente_supabase
        .from('transacoes')
        .insert([novaTransacao]);

    if (error) {
        console.error("Erro ao salvar:", error);
        return;
    }

    await carregarTransacoes(); 
}

/**
 * EXCLUSÃO SEGURA
 * O RLS no banco garante que você só deleta se for o dono.
 */
async function excluirTransacao(idTransacao) {
    const { error } = await cliente_supabase
        .from('transacoes')
        .delete()
        .eq('id', idTransacao);

    if (error) {
        console.error("Erro ao excluir:", error);
        return;
    }

    await carregarTransacoes(); 
}

function calcularSaldoTotal() {
    return transacoes.reduce((acc, t) => {
        return t.tipo === "receita" ? acc + t.valor : acc - t.valor;
    }, 0);
}

/**
 * INICIALIZAÇÃO ORQUESTRADA
 * Garante que a sessão é verificada ANTES de qualquer busca.
 */
document.addEventListener('DOMContentLoaded', async () => {
    const logado = await verificarSessao();
    if (logado) {
        await carregarTransacoes();
        await carregarMetas();
    }
});
