const API = '/gastos';

const MONTH_NAMES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

let yearAtual = new Date().getFullYear();
let mesIdxAtual = new Date().getMonth(); // 0-11
let todosGastos = [];

async function listarGastos() {
  const res = await fetch(API);
  todosGastos = await res.json();
  preencherAnos();
  renderMonthButtons();
  filtrarEAtualizar();
}

function anosDisponiveis() {
  const set = new Set(todosGastos.map(g => g.data.slice(0,4)));
  set.add(String(yearAtual)); // garante ano atual se não houver dados ainda
  return Array.from(set).sort((a,b)=>b-a);
}

function preencherAnos() {
  const sel = document.getElementById('year-select');
  const anos = anosDisponiveis();
  sel.innerHTML = anos.map(a=>`<option value="${a}">${a}</option>`).join('');
  sel.value = yearAtual;
}

document.getElementById('year-select').addEventListener('change', e=>{
  yearAtual = e.target.value;
  renderMonthButtons();
  filtrarEAtualizar();
});

function renderMonthButtons(){
  const container = document.getElementById('months-container');
  container.innerHTML = '';
  MONTH_NAMES.forEach((nome, idx)=>{
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.dataset.idx = idx;
    btn.className = `btn btn-sm month-btn ${idx===mesIdxAtual?'active':''}`;
    btn.textContent = nome;
    btn.onclick = ()=>{ mesIdxAtual = idx; renderMonthButtons(); filtrarEAtualizar();};
    container.appendChild(btn);
  });
}

function filtrarEAtualizar(){
  const prefix = `${yearAtual}-${String(mesIdxAtual+1).padStart(2,'0')}`;
  const filtrados = todosGastos.filter(g=>g.data.startsWith(prefix));
  atualizarTabela(filtrados);
  atualizarGraficos(filtrados);
  document.getElementById('dia').value='';
}

document.getElementById('form-gasto').addEventListener('submit', async event => {
  event.preventDefault();
  if (!yearAtual || !mesIdxAtual) return;
  const diaValor = document.getElementById('dia').value;
  const dia = String(diaValor).padStart(2, '0');
  const dataStr = `${yearAtual}-${String(mesIdxAtual+1).padStart(2,'0')}-${dia}`;
  const novo = {
    data: dataStr,
    descricao: document.getElementById('descricao').value,
    categoria: document.getElementById('categoria').value,
    valor: parseFloat(document.getElementById('valor').value)
  };
  await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(novo)
  });
  event.target.reset();
  listarGastos();
});

document.querySelector('#tabela-gastos tbody').addEventListener('click', async e => {
  if (e.target.matches('.excluir')) {
    const id = e.target.dataset.id;
    await fetch(`${API}/${id}`, { method: 'DELETE' });
    listarGastos();
  }
});

function atualizarTabela(gastos) {
  const tbody = document.querySelector('#tabela-gastos tbody');
  tbody.innerHTML = '';
  gastos.forEach(g => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${g.data}</td>
      <td>${g.descricao}</td>
      <td>${g.categoria}</td>
      <td>R$ ${Number(g.valor).toFixed(2)}</td>
      <td><button class="btn btn-danger btn-sm excluir" data-id="${g.id}">Excluir</button></td>
    `;
    tbody.appendChild(tr);
  });
}

let graficoCategorias;

function atualizarGraficos(gastos) {
  const categoriaSoma = {};
  const mensalSoma = {};
  gastos.forEach(g => {
    const valor = Number(g.valor);
    categoriaSoma[g.categoria] = (categoriaSoma[g.categoria] || 0) + valor;
    const mes = g.data.slice(0, 7);
    mensalSoma[mes] = (mensalSoma[mes] || 0) + valor;
  });

  const categorias = Object.keys(categoriaSoma);
  const valoresCat = Object.values(categoriaSoma);
  const meses = Object.keys(mensalSoma).sort(); // não usado, mas mantido se precisar no futuro
  const valoresMes = meses.map(m => mensalSoma[m]);

  const total = gastos.reduce((acc, g) => acc + Number(g.valor), 0);

  if (graficoCategorias) graficoCategorias.destroy();
  // nenhum gráfico mensal a destruir

  graficoCategorias = new Chart(document.getElementById('grafico-categorias'), {
    type: 'pie',
    data: {
      labels: categorias,
      datasets: [{ data: valoresCat, backgroundColor: gerarCores(categorias.length) }]
    },
    options: {
      maintainAspectRatio: false,
      responsive: true,
      plugins: { legend: { position: 'bottom' } }
    }
  });

  document.getElementById('total-gastos').textContent = `Total: R$ ${total.toFixed(2)}`;
}

function gerarCores(qt) {
  const cores = [];
  for (let i = 0; i < qt; i++) {
    const h = Math.floor((360 / qt) * i);
    cores.push(`hsl(${h},70%,60%)`);
  }
  return cores;
}

listarGastos();