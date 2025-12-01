const express = require('express');
const app = express();
const path = require('path');
const database = require('./src/config/database');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

// Controllers
const rastreadorController = require('./src/controllers/rastreador-controller');
const movimentacaoController = require('./src/controllers/movimentacao-controller');
const manutencaoController = require('./src/controllers/manutencao-controller');
const clienteController = require('./src/controllers/cliente-controller');

// --- ROTAS DO SISTEMA ---

// RASTREADOR (CRUD)
app.get('/', rastreadorController.consultar); // Dashboard
app.get('/rastreador/novo', rastreadorController.exibirTelaCadastro); // [NOVO] Tela separada
app.post('/rastreador', rastreadorController.cadastrar);
app.get('/rastreador/:id', rastreadorController.detalhar);
app.post('/rastreador/:id/deletar', rastreadorController.excluir); // [NOVO] Rota de Exclusão

// CLIENTES (CRUD)
app.get('/clientes', clienteController.index);
app.post('/clientes', clienteController.cadastrar);
app.post('/clientes/:id/deletar', clienteController.excluir); // [NOVO] Rota de Exclusão

// MOVIMENTAÇÃO
app.get('/movimentacao', movimentacaoController.exibirTela);
app.post('/movimentacao', movimentacaoController.registrarMovimentacao);

// MANUTENÇÃO
app.get('/manutencao', manutencaoController.exibirTela);
app.post('/manutencao', manutencaoController.registrarManutencao);

// Start
database.sync().then(() => {
    app.listen(3000, () => {
        console.log('--- SIGRA RODANDO (Versão Final) ---');
        console.log('Acesse: http://localhost:3000');
    });
});