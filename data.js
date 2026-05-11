// ==========================================
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

    if (error) {
        console.error("Erro ao buscar dados:", error);
        return;
    }

    // Se deu certo, atualizamos nosso array local e mostramos no console
    transacoes = data;
    console.log("[Banco de Dados] Transações carregadas:", transacoes);
    console.log("Saldo Atualizado: R$", calcularSaldoTotal());
    
    // avisa o arquivo do Aluno 3 para desenhar a tela
    if (typeof atualizarTela === "function") {
        atualizarTela(); 
    }
}

// Salva um novo dado no Banco de Dados (Nuvem)
async function adicionarTransacao(textoDescricao, numeroValor, textoTipo, textoData, textoCategoria, booleanoRecorrente) {
    console.log("Salvando no banco de dados...");

    // O Supabase gera o ID automaticamente lá no servidor, não precisamos mandar
    const novaTransacao = {
        descricao: textoDescricao,
        valor: numeroValor,
        tipo: textoTipo,
        data: textoData,
        categoria: textoCategoria,
        recorrente: booleanoRecorrente
    };

    const { data, error } = await cliente_supabase
        .from('transacoes')
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
    const { error } = await cliente_supabase
        .from('transacoes')
        .delete()
        .eq('id', idTransacao);

    if (error) {
        console.error("Erro ao excluir transação:", error);
        return;
    }

    console.log("[Sucesso] Transação excluída da nuvem!");
    
    await carregarTransacoes(); 
}

function calcularSaldoTotal() {
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