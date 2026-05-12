// ==========================================
<<<<<<< HEAD
// data.js - Lógica e Dados 
// ==========================================

// Inicializa a conexão com o Supabase
const SUPABASE_URL = 'https://ghxeseaavjuzhttilzrq.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoeGVzZWFhdmp1emh0dGlsenJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0NzY4NzYsImV4cCI6MjA5NDA1Mjg3Nn0.Zn7YE7yKCNbiVVzKJ6RJaeN1JICzxXeIGQsCYrNd_L4';
const cliente_supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Nosso array local continua existindo para alimentar a tela mais rápido
let transacoes = [];

// Busca os dados no Banco de Dados (Nuvem)
async function carregarTransacoes() {
    console.log("Buscando dados no Supabase...");
    
    // O 'await' faz o código esperar a internet responder
    const { data, error } = await cliente_supabase
        .from('transacoes')
        .select('*'); // todas as colunas
=======
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
>>>>>>> main

    if (error) {
        console.error("Erro ao buscar dados:", error);
        return;
    }

<<<<<<< HEAD
    // Se deu certo, atualizamos nosso array local e mostramos no console
    transacoes = data;
    console.log("[Banco de Dados] Transações carregadas:", transacoes);
    console.log("Saldo Atualizado: R$", calcularSaldoTotal());
    
    // avisa o arquivo do Aluno 3 para desenhar a tela
=======
    transacoes = data;
    
>>>>>>> main
    if (typeof atualizarTela === "function") {
        atualizarTela(); 
    }
}

<<<<<<< HEAD
// Salva um novo dado no Banco de Dados (Nuvem)
async function adicionarTransacao(textoDescricao, numeroValor, textoTipo, textoData, textoCategoria, booleanoRecorrente) {
    console.log("Salvando no banco de dados...");

    // O Supabase gera o ID automaticamente lá no servidor, não precisamos mandar
=======
/**
 * INSERÇÃO VINCULADA
 * Adiciona a transação já "carimbada" com o ID do dono.
 */
async function adicionarTransacao(textoDescricao, numeroValor, textoTipo, textoData, textoCategoria, booleanoRecorrente) {
    if (!usuarioLogado) return;

>>>>>>> main
    const novaTransacao = {
        descricao: textoDescricao,
        valor: numeroValor,
        tipo: textoTipo,
        data: textoData,
        categoria: textoCategoria,
<<<<<<< HEAD
        recorrente: booleanoRecorrente
=======
        recorrente: booleanoRecorrente,
        user_id: usuarioLogado.id // 🔗 Amarração com o dono
>>>>>>> main
    };

    const { data, error } = await cliente_supabase
        .from('transacoes')
<<<<<<< HEAD
        .insert([novaTransacao])
        .select(); // Pede pro Supabase devolver o dado salvo (agora com o ID oficial)

    if (error) {
        console.error("Erro ao salvar transação:", error);
        return;
    }

    console.log(`[Sucesso] Transação "${textoDescricao}" salva na nuvem!`);
    
    // Recarrega a lista toda para manter tudo sincronizado
    await carregarTransacoes(); 
}

// Remove um dado do Banco de Dados (Nuvem)
async function excluirTransacao(idTransacao) {
    console.log(`Excluindo transação ID: ${idTransacao}...`);

    // Pede para o Supabase deletar a linha onde a coluna 'id' seja igual ao id passado
=======
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
>>>>>>> main
    const { error } = await cliente_supabase
        .from('transacoes')
        .delete()
        .eq('id', idTransacao);

    if (error) {
<<<<<<< HEAD
        console.error("Erro ao excluir transação:", error);
        return;
    }

    console.log("[Sucesso] Transação excluída da nuvem!");
    
=======
        console.error("Erro ao excluir:", error);
        return;
    }

>>>>>>> main
    await carregarTransacoes(); 
}

function calcularSaldoTotal() {
<<<<<<< HEAD
    let saldo = 0;
    for (let i = 0; i < transacoes.length; i++) {
        if (transacoes[i].tipo === "receita") {
            saldo += transacoes[i].valor;
        } else if (transacoes[i].tipo === "despesa") {
            saldo -= transacoes[i].valor;
        }
    }
    return saldo;
}

// Inicia o sistema buscando os dados assim que o arquivo é lido
carregarTransacoes();
=======
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
>>>>>>> main
