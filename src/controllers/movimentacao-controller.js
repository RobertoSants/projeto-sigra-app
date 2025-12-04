const Movimentacao = require('../models/movimentacao');
const Rastreador = require('../models/rastreador');
const Cliente = require('../models/cliente');
// [NOVO] Importamos Usuario para preencher a lista de responsáveis
const Usuario = require('../models/usuario');

module.exports = {
    // Exibe a TelaMovimentacao (Boundary)
    async exibirTela(req, res) {
        const rastreadores = await Rastreador.findAll();
        // [ATUALIZADO] Carrega clientes para o select de destino (Ideia 2)
        const clientes = await Cliente.findAll();
        
        // [NOVO] Busca todos os usuários para preencher a lista de "Responsável pela Ação"
        // Evita erro de digitação (User request)
        const usuarios = await Usuario.findAll();

        // Envia rastreadores, clientes E usuários para a tela
        res.render('tela-movimentacao', { rastreadores, clientes, usuarios });
    },

    // [Diagrama de Atividade CSU02] Registrar Movimentação
    async registrarMovimentacao(req, res) {
        const { rastreadorId, tipo, responsavel, clienteId, destino_texto } = req.body;

        try {
            // 1. Validar Status (Diagrama de Atividade)
            const rastreador = await Rastreador.findByPk(rastreadorId);
            
            // [Diagrama de Atividade] Decisão: "Rastreador em manutenção?"
            // [ATUALIZADO] Regra mais descritiva: Se está em manutenção, o Operador não pode mover.
            if (rastreador.status === 'Em Manutenção' && tipo === 'SAIDA') {
                return res.send(`
                    <h2>🚫 Bloqueio de Segurança [Diagrama de Atividade]</h2>
                    <p>O rastreador está <strong>EM MANUTENÇÃO</strong>.</p>
                    <p>Para liberá-lo, o Técnico precisa finalizar o serviço na tela de Manutenção (CSU03).</p>
                    <a href="/movimentacao">Voltar</a>
                `);
            }

            // [NOVO] Lógica de Destino: Se for SAIDA, usa o ID do Cliente. Senão, usa texto.
            let dadosMovimentacao = {
                tipo,
                responsavel,
                rastreadorId
            };

            if (tipo === 'SAIDA' && clienteId) {
                dadosMovimentacao.clienteId = clienteId; // Vincula ao cliente real
            } else {
                dadosMovimentacao.destino_texto = destino_texto; // Usa texto livre
            }

            // 2. Registrar a Movimentação (Entity Movimentacao - Diagrama de Sequência)
            await Movimentacao.create(dadosMovimentacao);

            // 3. Atualizar Status do Rastreador (Entity Rastreador - Diagrama de Sequência)
            // [RN04] Atualização automática de status
            let novoStatus = rastreador.status;
            if (tipo === 'SAIDA') novoStatus = 'Em Uso (Cliente)';
            if (tipo === 'ENTRADA') novoStatus = 'Em Estoque';
            if (tipo === 'TRANSFERENCIA') novoStatus = 'Em Trânsito';

            await rastreador.update({ status: novoStatus });

            // 4. [Diagrama de Sequência] Ação: "Exibir sucesso"
            res.redirect('/');
        } catch (error) {
            res.send("Erro ao registrar movimentação: " + error.message);
        }
    }
};