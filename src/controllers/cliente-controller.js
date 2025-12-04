const Cliente = require('../models/cliente');
// [NOVO] Precisamos importar Movimentacao para verificar se o cliente tem histórico
const Movimentacao = require('../models/movimentacao');

module.exports = {
    // Lista clientes
    async index(req, res) {
        const clientes = await Cliente.findAll();
        res.render('tela-gerenciar-clientes', { clientes });
    },

    // Cadastra cliente com validação de Duplicidade
    async cadastrar(req, res) {
        try {
            await Cliente.create(req.body);
            res.redirect('/clientes');
        } catch (error) {
            // [CORREÇÃO] Se o erro for de "Constraint Unique" (Duplicidade)
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.send(`
                    <div style="text-align: center; font-family: sans-serif; padding: 50px;">
                        <h2 style="color: red;">Erro: Documento Duplicado!</h2>
                        <p>O CPF/CNPJ informado já está cadastrado para outro cliente.</p>
                        <a href="/clientes">Voltar e Corrigir</a>
                    </div>
                `);
            }
            res.send("Erro ao cadastrar cliente: " + error.message);
        }
    },

    // [CORREÇÃO] Excluir Cliente com Validação de Vínculo (Integridade Referencial)
    async excluir(req, res) {
        const { id } = req.params;
        try {
            // 1. Verifica se o cliente tem movimentações (histórico)
            // Conta quantas vezes esse cliente aparece na tabela de Movimentação
            const usos = await Movimentacao.count({ where: { clienteId: id } });

            if (usos > 0) {
                // Se tiver histórico, BLOQUEIA a exclusão
                return res.send(`
                    <div style="text-align: center; font-family: sans-serif; padding: 50px;">
                        <h2 style="color: #dc3545;">🚫 Exclusão Bloqueada</h2>
                        <p>Este cliente possui <strong>${usos} movimentações</strong> registradas no histórico.</p>
                        <p>Por questões de auditoria e integridade, não é possível apagar clientes que já receberam equipamentos.</p>
                        <hr>
                        <a href="/clientes" style="padding: 10px; background: #007bff; color: white; text-decoration: none; border-radius: 5px;">Voltar</a>
                    </div>
                `);
            }

            // 2. Se não tiver uso, permite excluir
            await Cliente.destroy({ where: { id } });
            res.redirect('/clientes');
        } catch (error) {
            res.send("Erro ao excluir cliente: " + error.message);
        }
    }
};