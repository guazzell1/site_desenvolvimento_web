// ===================================================
// dashboard.js — Aluno 3: Renderização do DOM
// ===================================================
// Esse arquivo lê os dados do data.js e exibe na tela.
// Ele nunca salva dados, só lê e desenha.
// ===================================================

// ===================================================
// MOCK TEMPORÁRIO — apagar quando o Aluno 2 terminar
// ===================================================

let transacoes = [
  { id: 1, descricao: "Salário",  valor: 3000, tipo: "receita", categoria: "outros",      data: "2026-05-01" },
  { id: 2, descricao: "Aluguel",  valor: 1200, tipo: "despesa", categoria: "moradia",     data: "2026-05-05" },
  { id: 3, descricao: "Mercado",  valor: 350,  tipo: "despesa", categoria: "alimentacao", data: "2026-05-07" }
];

function calcularSaldoTotal() {
    let saldo = 0;

    transacoes.forEach(function(t) {
        if (t.tipo === "receita")  {
            saldo += t.valor;
        } else {
            saldo -= t.valor;
        }
    });

    return saldo;
}

function calcularEntradaDoMes() {
    let total = 0;

    transacoes.forEach(function(t) {
        if (t.tipo === "receita") {
            total += t.valor;
        }
    });

    return total;
}

function calcularSaidaDoMes() {
    let total = 0;

    transacoes.forEach(function(t) {
        if (t.tipo === "despesa") {
            total += t.valor;
        }
    });

    return total;
}