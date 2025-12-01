const Manutencao = require('../models/manutencao');
const Rastreador = require('../models/rastreador');

module.exports = {
    // Exibe a tela (Boundary)
    async exibirTela(req, res) {
        const rastreadores = await Rastreador.findAll();
        res.render('tela-registrar-manutencao', { rastreadores });
    },

    // [Diagrama de Sequência CSU03] Método Principal
    async registrarManutencao(req, res) {
        const { rastreadorId, descricao, tecnico } = req.body;

        try {
            // 1. [Diagrama de Sequência] Ação: "Registrar manutenção"
            await Manutencao.create({
                descricao,
                tecnico,
                rastreadorId
            });

            // 2. [Diagrama de Sequência] Ação: "Atualizar status"
            // [RN04] Muda status para 'Em Manutenção'
            await Rastreador.update(
                { status: 'Em Manutenção' },
                { where: { id: rastreadorId } }
            );

            // 3. Retorno de sucesso
            res.redirect('/');
        } catch (error) {
            res.send("Erro ao registrar manutenção.");
        }
    }
};