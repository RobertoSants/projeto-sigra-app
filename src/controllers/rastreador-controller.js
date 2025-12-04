const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const Rastreador = require('../models/rastreador');
const Movimentacao = require('../models/movimentacao');
const Manutencao = require('../models/manutencao');
const Cliente = require('../models/cliente');

module.exports = {
    // [Diagrama de Classes Arquitetural] Método: consultar
    async consultar(req, res) {
        const { busca } = req.query;
        
        let filtro = {};
        if (busca) {
            filtro = {
                [Op.or]: [
                    { imei: { [Op.like]: `%${busca}%` } },
                    { modelo: { [Op.like]: `%${busca}%` } }
                ]
            };
        }

        const rastreadores = await Rastreador.findAll({ where: filtro });

        const kpis = {
            total: await Rastreador.count(),
            estoque: await Rastreador.count({ where: { status: 'Em Estoque' } }),
            cliente: await Rastreador.count({ where: { status: 'Em Uso (Cliente)' } }),
            manutencao: await Rastreador.count({ where: { status: 'Em Manutenção' } })
        };
        
        res.render('tela-gerenciar-rastreadores', { rastreadores, kpis, termoBusca: busca });
    },

    // Método para renderizar a tela exclusiva de cadastro
    async exibirTelaCadastro(req, res) {
        res.render('tela-cadastrar-rastreador');
    },

    // [Diagrama de Sequência CSU01] Método: cadastrar
    async cadastrar(req, res) {
        try {
            const { imei, fabricante, modelo, operadora, numero_chip, linha_chip } = req.body;
            
            await Rastreador.create({ 
                imei, fabricante, modelo, operadora, numero_chip, linha_chip 
            });
            
            res.redirect('/');
        } catch (error) {
            res.send("ERRO: IMEI já cadastrado ou dados inválidos. [RN01]");
        }
    },

    // [ATUALIZADO] Método excluir com Regra de Segurança Rígida
    async excluir(req, res) {
        const { id } = req.params;
        try {
            // 1. Busca o rastreador primeiro para checar o status
            const rastreador = await Rastreador.findByPk(id);

            if (!rastreador) {
                return res.send("Rastreador não encontrado.");
            }

            // 2. [Regra de Negócio] Só permite excluir se estiver em ESTOQUE
            // Qualquer outro status (Em Uso, Em Manutenção, Em Trânsito) será bloqueado.
            if (rastreador.status !== 'Em Estoque') {
                return res.send(`
                    <div style="font-family: sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; text-align: center;">
                        <h2 style="color: #dc3545;">🚫 Ação Bloqueada por Segurança</h2>
                        <p>O rastreador IMEI <strong>${rastreador.imei}</strong> está com status atual: <strong>${rastreador.status}</strong>.</p>
                        <p>Para garantir a integridade do histórico, <strong>apenas equipamentos "Em Estoque" podem ser excluídos</strong>.</p>
                        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                        <p style="color: #666;">Dica: Se ele estiver em manutenção ou cliente, faça a movimentação de retorno (ENTRADA) primeiro.</p>
                        <br>
                        <a href="/" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Voltar ao Painel</a>
                    </div>
                `);
            }

            // 3. Se estiver "Em Estoque", permite a exclusão
            await rastreador.destroy();
            res.redirect('/');
        } catch (error) {
            res.send("Erro ao excluir: O rastreador possui histórico vinculado e não pode ser apagado por segurança. Tente limpar o histórico primeiro.");
        }
    },

    // Método: detalhar (Histórico Completo)
    async detalhar(req, res) {
        const { id } = req.params;
        try {
            const rastreador = await Rastreador.findByPk(id, {
                include: [
                    { 
                        model: Movimentacao,
                        include: [{ model: Cliente }]
                    },
                    { model: Manutencao }
                ]
            });

            if (!rastreador) return res.send("Rastreador não encontrado!");
            
            res.render('tela-detalhes-rastreador', { rastreador });
        } catch (error) {
            console.error(error);
            res.send("Erro: " + error.message);
        }
    }
};