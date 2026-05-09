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

// 3. Área de Testes (Para rodar no Console)
console.log("=== SISTEMA CENTZ: TESTE DE LÓGICA ===");
console.log("Total de transações cadastradas:", transacoes.length);
console.log("Saldo calculado: R$", calcularSaldoTotal());