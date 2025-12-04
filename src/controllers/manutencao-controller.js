const Manutencao = require('../models/manutencao');
const Rastreador = require('../models/rastreador');
const Usuario = require('../models/usuario'); // [NOVO] Importamos Usuario

module.exports = {
    // Exibe a tela (Boundary)
    async exibirTela(req, res) {
        const rastreadores = await Rastreador.findAll();
        
        // [NOVO] Busca apenas usuários que são Técnicos para preencher o select
        const tecnicos = await Usuario.findAll({ where: { cargo: 'Tecnico' } });

        // Envia rastreadores E técnicos para a tela
        res.render('tela-registrar-manutencao', { rastreadores, tecnicos });
    },

    // [Diagrama de Sequência CSU03] Registrar Manutenção
    async registrarManutencao(req, res) {
        const { rastreadorId, descricao, tecnico } = req.body;

        try {
            // 1. Grava histórico do defeito
            await Manutencao.create({ descricao, tecnico, rastreadorId });

            // 2. Atualiza status para 'Em Manutenção'
            await Rastreador.update(
                { status: 'Em Manutenção' },
                { where: { id: rastreadorId } }
            );

            res.redirect('/');
        } catch (error) {
            res.send("Erro ao registrar manutenção.");
        }
    }
};