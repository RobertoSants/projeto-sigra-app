const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const Rastreador = require('../models/rastreador');
const Movimentacao = require('../models/movimentacao');
const Manutencao = require('../models/manutencao');
// [CORREÇÃO] Importante: Precisamos importar o Cliente para incluí-lo na busca
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

    // [NOVO] Método para renderizar a tela exclusiva de cadastro
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

    // [NOVO] Método para excluir Rastreador
    async excluir(req, res) {
        const { id } = req.params;
        try {
            await Rastreador.destroy({ where: { id } });
            res.redirect('/');
        } catch (error) {
            res.send("Erro ao excluir: O rastreador possui histórico vinculado e não pode ser apagado por segurança.");
        }
    },

    // [CORREÇÃO AQUI] Método: detalhar
    async detalhar(req, res) {
        const { id } = req.params;
        try {
            const rastreador = await Rastreador.findByPk(id, {
                include: [
                    { 
                        model: Movimentacao,
                        // [O PULO DO GATO]: Include Aninhado (Nested Include)
                        // Dizemos: "Traga as movimentações E, dentro delas, traga os Clientes"
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