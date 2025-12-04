const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser'); // [NOVO] Para ler o login
const database = require('./src/config/database');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(cookieParser()); // [NOVO]

// Controllers
const rastreadorController = require('./src/controllers/rastreador-controller');
const movimentacaoController = require('./src/controllers/movimentacao-controller');
const manutencaoController = require('./src/controllers/manutencao-controller');
const clienteController = require('./src/controllers/cliente-controller');
const authController = require('./src/controllers/auth-controller'); // [NOVO]

// --- MIDDLEWARE DE AUTENTICAÇÃO ---
// Roda em todas as requisições
app.use((req, res, next) => {
    // Rotas públicas (não precisa logar)
    if (req.path === '/login') return next();

    const usuarioId = req.cookies.usuarioId;
    
    if (!usuarioId) {
        return res.redirect('/login');
    }

    // Deixa os dados do usuário disponíveis para todas as Views (EJS)
    // Assim podemos fazer "if (usuario.cargo === 'Admin')" no HTML
    res.locals.usuario = {
        id: req.cookies.usuarioId,
        nome: req.cookies.usuarioNome,
        cargo: req.cookies.usuarioCargo
    };
    
    next();
});

// --- ROTAS ---

// Autenticação
app.get('/login', authController.exibirLogin);
app.post('/login', authController.logar);
app.get('/logout', authController.logout);

// Rastreadores
app.get('/', rastreadorController.consultar);
app.get('/rastreador/novo', rastreadorController.exibirTelaCadastro);
app.post('/rastreador', rastreadorController.cadastrar);
app.get('/rastreador/:id', rastreadorController.detalhar);
app.post('/rastreador/:id/deletar', rastreadorController.excluir);

// [NOVO] Rotas de Edição (RF01)
app.get('/rastreador/:id/editar', rastreadorController.exibirTelaEdicao);
app.post('/rastreador/:id/editar', rastreadorController.editar);

// Clientes
app.get('/clientes', clienteController.index);
app.post('/clientes', clienteController.cadastrar);
app.post('/clientes/:id/deletar', clienteController.excluir);

// Movimentação
app.get('/movimentacao', movimentacaoController.exibirTela);
app.post('/movimentacao', movimentacaoController.registrarMovimentacao);

// Manutenção
app.get('/manutencao', manutencaoController.exibirTela);
app.post('/manutencao', manutencaoController.registrarManutencao);

// Start
database.sync().then(async () => {
    // Cria os usuários padrão se não existirem
    await authController.iniciarUsuariosPadrao();
    
    // [AJUSTE CLOUD] Porta dinâmica
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`--- SIGRA RODANDO NA PORTA ${PORT} ---`);
    });
});