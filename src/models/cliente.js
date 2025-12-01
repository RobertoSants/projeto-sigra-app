const Sequelize = require('sequelize');
const database = require('../config/database');

// [NOVO - Ideia 2] Entidade Cliente Real
// Substitui o uso de strings soltas para garantir integridade dos dados
const Cliente = database.define('cliente', {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    nome: { type: Sequelize.STRING, allowNull: false },
    documento: { type: Sequelize.STRING }, // CPF ou CNPJ
    endereco: { type: Sequelize.STRING },
    telefone: { type: Sequelize.STRING }
});

module.exports = Cliente;