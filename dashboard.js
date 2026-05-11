// ===================================================
// dashboard.js — Renderização do DOM
// ===================================================


function formatarMoeda(valor) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

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

  document.querySelector('#display-saldo').innerText = formatarMoeda(saldoAtual);
  document.querySelector('#card-income').innerText   = formatarMoeda(entradas);
  document.querySelector('#card-expense').innerText  = formatarMoeda(saidas);

  const elSaldo = document.querySelector('#display-saldo');
  elSaldo.style.color = saldoAtual < 0 ? "#ef4444" : "";

  renderizarTabela();
}

function renderizarTabela() {
  const tbody         = document.querySelector('#lista-transacoes');
  const tbodyCompleta = document.querySelector('#lista-transacoes-completa');

  tbody.innerHTML         = "";
  tbodyCompleta.innerHTML = "";

  if (transacoes.length === 0) {
    const msgVazia = `
      <tr>
        <td colspan="5" style="text-align:center; padding:2rem; color:#888;">
          Nenhuma transação cadastrada ainda.
        </td>
      </tr>
    `;
    tbody.innerHTML         = msgVazia;
    tbodyCompleta.innerHTML = msgVazia;
    return; 
  }

  transacoes.forEach(function(t) {
    const tr = document.createElement('tr');

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

    tbody.appendChild(tr.cloneNode(true));
    tbodyCompleta.appendChild(tr);
  });
}