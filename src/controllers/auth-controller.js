const Usuario = require('../models/usuario');

module.exports = {
    // Exibe a tela de login
    exibirLogin(req, res) {
        // Se já tiver erro na URL, manda para a view
        const { erro } = req.query;
        res.render('tela-login', { erro });
    },

    // Processa o login
    async logar(req, res) {
        const { email, senha } = req.body;

        const usuario = await Usuario.findOne({ where: { email, senha } });

        if (!usuario) {
            return res.redirect('/login?erro=1');
        }

        // Salva o usuário num cookie simples (simulação de sessão)
        // Em produção real usaríamos 'express-session' ou JWT
        res.cookie('usuarioId', usuario.id);
        res.cookie('usuarioCargo', usuario.cargo);
        res.cookie('usuarioNome', usuario.nome);

        res.redirect('/');
    },

    // Sai do sistema
    logout(req, res) {
        res.clearCookie('usuarioId');
        res.clearCookie('usuarioCargo');
        res.clearCookie('usuarioNome');
        res.redirect('/login');
    },

    // [IMPORTANTE] Cria usuários padrão se o banco estiver vazio
    // Roda automaticamente no início para você não ficar trancado fora
    async iniciarUsuariosPadrao() {
        const total = await Usuario.count();
        if (total === 0) {
            await Usuario.bulkCreate([
                { nome: 'Roberto Admin', email: 'admin@sigra.com', senha: '123', cargo: 'Administrador' },
                { nome: 'Ivo Estoque', email: 'operador@sigra.com', senha: '123', cargo: 'Operador' },
                { nome: 'Wal Técnico', email: 'tecnico@sigra.com', senha: '123', cargo: 'Tecnico' }
            ]);
            console.log('--- USUÁRIOS PADRÃO CRIADOS ---');
            console.log('Admin: admin@sigra.com / 123');
            console.log('Operador: operador@sigra.com / 123');
            console.log('Técnico: tecnico@sigra.com / 123');
        }
    }
};