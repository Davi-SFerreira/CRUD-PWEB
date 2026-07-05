const express = require('express');
const app = express();

// Diz pro Express usar EJS pra renderizar as páginas
app.set('view engine', 'ejs');

// Permite ler dados enviados por formulários HTML
app.use(express.urlencoded({ extended: true }));

// ⬇️ Aqui está o "banco de dados em memória"
// É só um array de objetos que vive enquanto o servidor roda
let produtos = [
  { id: 1, nome: 'Caneta', preco: 2.50 },
  { id: 2, nome: 'Caderno', preco: 15.00 },
];
let proximoId = 3; // Controla o id do próximo produto criado

// =====================
//   LOGIN (simples)
// =====================

// Mostra a tela de login
app.get('/login', (req, res) => {
  res.render('login', { erro: null });
});

// Processa o login
app.post('/login', (req, res) => {
  const { usuario, senha } = req.body;

  // Usuário e senha fixos no código (sem banco de verdade)
  if (usuario === 'admin' && senha === '1234') {
    res.redirect('/');
  } else {
    res.render('login', { erro: 'Usuário ou senha inválidos' });
  }
});

// =====================
//   READ — listar todos
// =====================
app.get('/', (req, res) => {
  res.render('index', { produtos });
});

// =====================
//   CREATE — criar novo
// =====================
app.post('/produtos', (req, res) => {
  const { nome, preco } = req.body;
  produtos.push({ id: proximoId++, nome, preco: parseFloat(preco) });
  res.redirect('/');
});

// =====================
//   UPDATE — editar
// =====================

// Mostra o formulário de edição com os dados atuais
app.get('/produtos/editar/:id', (req, res) => {
  const produto = produtos.find(p => p.id === parseInt(req.params.id));
  if (!produto) return res.status(404).send('Produto não encontrado');
  res.render('edit', { produto });
});

// Salva as alterações
app.post('/produtos/editar/:id', (req, res) => {
  const produto = produtos.find(p => p.id === parseInt(req.params.id));
  if (!produto) return res.status(404).send('Produto não encontrado');
  produto.nome = req.body.nome;
  produto.preco = parseFloat(req.body.preco);
  res.redirect('/');
});

// =====================
//   DELETE — deletar
// =====================
app.post('/produtos/deletar/:id', (req, res) => {
  produtos = produtos.filter(p => p.id !== parseInt(req.params.id));
  res.redirect('/');
});

// =====================
//   Sobe o servidor
// =====================
app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});