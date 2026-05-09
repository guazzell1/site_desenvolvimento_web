// ==========================================
// data.js - Lógica e Dados 
// ==========================================

// 1. O Banco de Dados de Mentira (Array de Objetos)
// Cada objeto dentro das chaves {} representa uma transação única.
let transacoes = [
    {
        id: 1,
        descricao: "Mesada / Salário",
        valor: 1500.00,
        tipo: "receita",
        data: "2026-05-01"
    },
    {
        id: 2,
        descricao: "Lanche da faculdade",
        valor: 25.50,
        tipo: "despesa",
        data: "2026-05-05"
    },
    {
        id: 3,
        descricao: "Mensalidade do Spotify",
        valor: 21.90,
        tipo: "despesa",
        data: "2026-05-08"
    }
];

// 2. A Inteligência do Negócio (Função de Cálculo)
function calcularSaldoTotal() {
    let saldo = 0; // Começamos com a conta zerada

    // Laço de repetição clássico para percorrer a lista
    for (let i = 0; i < transacoes.length; i++) {
        let transacaoAtual = transacoes[i];

        // Regra de negócio: se for receita, soma. Se for despesa, subtrai.
        if (transacaoAtual.tipo === "receita") {
            saldo = saldo + transacaoAtual.valor;
        } else if (transacaoAtual.tipo === "despesa") {
            saldo = saldo - transacaoAtual.valor;
        }
    }

    return saldo; // Devolve o valor final processado
}

// Função para adicionar uma nova transação no sistema
function adicionarTransacao(textoDescricao, numeroValor, textoTipo, textoData) {
    
    // 1. Montamos o objeto igualzinho ao nosso "Contrato de Dados"
    const novaTransacao = {
        id: Date.now(), // Esse comando gera um número único na hora, perfeito para IDs
        descricao: textoDescricao,
        valor: numeroValor,
        tipo: textoTipo,
        data: textoData
    };

    // 2. Colocamos esse novo objeto dentro do nosso array principal
    transacoes.push(novaTransacao);

    // 3. Aviso no console para a gente saber que funcionou
    console.log(`[Sucesso] Transação "${textoDescricao}" adicionada!`);
}

// 3. Área de Testes (Para rodar no Console)
console.log("=== SISTEMA CENTZ: TESTE DE LÓGICA ===");
console.log("Total de transações cadastradas:", transacoes.length);
console.log("Saldo calculado: R$", calcularSaldoTotal());

// Simulando o Aluno 4 cadastrando a conta de luz
console.log("--- Testando o cadastro ---");
adicionarTransacao("Conta de Luz", 150.00, "despesa", "2026-05-15");

// Vamos ver se o sistema recalculou o saldo corretamente!
console.log("Novo total de transações:", transacoes.length);
console.log("Novo saldo atualizado: R$", calcularSaldoTotal());