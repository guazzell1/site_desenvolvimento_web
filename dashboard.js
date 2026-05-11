// ===================================================
// dashboard.js — Renderização do DOM
// ===================================================


// --------------------------------------------------
// FUNÇÃO: formatarMoeda(valor)
// Converte 2500.5 em "R$ 2.500,50" no padrão brasileiro
// toLocaleString() formata conforme as regras do país
// --------------------------------------------------
function formatarMoeda(valor) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}


// --------------------------------------------------
// FUNÇÃO: formatarData(dataString)
// Converte "2026-05-06" em "06/05/2026"
// split("-") quebra pelo traço → ["2026","05","06"]
// reverse() inverte → ["06","05","2026"]
// join("/") junta com barra → "06/05/2026"
// --------------------------------------------------
function formatarData(dataString) {
  return dataString.split('-').reverse().join('/');
}


function calcularEntradaDoMes() {
  let total = 0;
  transacoes.forEach(function(t) {
    if (t.tipo === "receita") total += t.valor;
  });
  return total;
}

function calcularSaidaDoMes() {
  let total = 0;
  transacoes.forEach(function(t) {
    if (t.tipo === "despesa") total += t.valor;
  });
  return total;
}

function atualizarTela() {
  const saldoAtual = calcularSaldoTotal();
  const entradas   = calcularEntradaDoMes();
  const saidas     = calcularSaidaDoMes();

  // Injeta nos cards usando formatação correta
  document.querySelector('#display-saldo').innerText = formatarMoeda(saldoAtual);
  document.querySelector('#card-income').innerText   = formatarMoeda(entradas);
  document.querySelector('#card-expense').innerText  = formatarMoeda(saidas);

  // Pinta saldo de vermelho se negativo
  const elSaldo = document.querySelector('#display-saldo');
  elSaldo.style.color = saldoAtual < 0 ? "#ef4444" : "";

  renderizarTabela();
}

function renderizarTabela() {
  const tbody = document.querySelector('#lista-transacoes');
  tbody.innerHTML = "";

  transacoes.forEach(function(t) {
    const tr = document.createElement('tr');

    // Define cor e sinal conforme o tipo
    const isReceita = t.tipo === "receita";
    const cor       = isReceita ? "#22c55e" : "#ef4444";
    const sinal     = isReceita ? "+" : "-";

    tr.innerHTML = `
      <td>${t.descricao}</td>
      <td style="text-transform: capitalize;">${t.categoria}</td>
      <td>${formatarData(t.data)}</td>
      <td style="color: ${cor}; font-weight: 600;">${sinal} ${formatarMoeda(t.valor)}</td>
      <td><button onclick="excluirTransacao(${t.id})" style="color:#ef4444; border:none; background:none; cursor:pointer;">🗑</button></td>
    `;

    tbody.appendChild(tr);
  });
}