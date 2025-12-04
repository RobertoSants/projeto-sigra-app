const Sequelize = require('sequelize');
const database = require('../config/database');

const Cliente = database.define('cliente', {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    nome: { type: Sequelize.STRING, allowNull: false },
    
    // [CORREÇÃO] 'unique: true' impede que o banco aceite dois iguais
    documento: { type: Sequelize.STRING, unique: true }, 
    
    endereco: { type: Sequelize.STRING },
    telefone: { type: Sequelize.STRING }
});

module.exports = Cliente;