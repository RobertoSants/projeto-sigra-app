const Cliente = require('../models/cliente');

module.exports = {
    // Lista clientes
    async index(req, res) {
        const clientes = await Cliente.findAll();
        res.render('tela-gerenciar-clientes', { clientes });
    },

    // Cadastra cliente
    async cadastrar(req, res) {
        try {
            await Cliente.create(req.body);
            res.redirect('/clientes');
        } catch (error) {
            res.send("Erro ao cadastrar cliente: " + error.message);
        }
    },

    // [NOVO] Excluir Cliente
    async excluir(req, res) {
        const { id } = req.params;
        try {
            await Cliente.destroy({ where: { id } });
            res.redirect('/clientes');
        } catch (error) {
            res.send("Erro ao excluir: Verifique se este cliente não possui movimentações vinculadas.");
        }
    }
};