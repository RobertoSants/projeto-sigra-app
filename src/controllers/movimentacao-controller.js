const Movimentacao = require('../models/movimentacao');
const Rastreador = require('../models/rastreador');
const Cliente = require('../models/cliente'); // [NOVO]

module.exports = {
    async exibirTela(req, res) {
        const rastreadores = await Rastreador.findAll();
        // [NOVO] Carrega clientes para o select da tela
        const clientes = await Cliente.findAll();

        res.render('tela-movimentacao', { rastreadores, clientes });
    },

    // [Diagrama de Atividade CSU02] Registrar Movimentação
    async registrarMovimentacao(req, res) {
        const { rastreadorId, tipo, responsavel, clienteId, destino_texto } = req.body;

        try {
            const rastreador = await Rastreador.findByPk(rastreadorId);
            
            // [Diagrama de Atividade] Bloqueio se estiver em manutenção
            if (rastreador.status === 'Em Manutenção' && tipo === 'SAIDA') {
                return res.send("ERRO BLOQUEANTE: O rastreador está em Manutenção.");
            }

            // [NOVO] Lógica de Destino: Cliente (ID) ou Texto Livre
            let dadosMovimentacao = {
                tipo, responsavel, rastreadorId
            };

            if (tipo === 'SAIDA' && clienteId) {
                dadosMovimentacao.clienteId = clienteId; // Vincula ao cliente real
            } else {
                dadosMovimentacao.destino_texto = destino_texto; // Usa texto livre
            }

            // 1. Grava histórico
            await Movimentacao.create(dadosMovimentacao);

            // 2. Atualiza status [RN04]
            let novoStatus = rastreador.status;
            if (tipo === 'SAIDA') novoStatus = 'Em Uso (Cliente)';
            if (tipo === 'ENTRADA') novoStatus = 'Em Estoque';
            if (tipo === 'TRANSFERENCIA') novoStatus = 'Em Trânsito';

            await rastreador.update({ status: novoStatus });

            res.redirect('/');
        } catch (error) {
            res.send("Erro ao registrar movimentação: " + error.message);
        }
    }
};