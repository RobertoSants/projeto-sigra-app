const Sequelize = require('sequelize');
const database = require('../config/database');

const Usuario = database.define('usuario', {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    nome: { type: Sequelize.STRING, allowNull: false },
    email: { type: Sequelize.STRING, allowNull: false, unique: true },
    senha: { type: Sequelize.STRING, allowNull: false }, // Em produção utilizaremos hash, aqui texto simples apenas para didática
    
    // O Cargo define o que ele pode fazer (Admin, Operador, Tecnico)
    cargo: { type: Sequelize.STRING, allowNull: false } 
});

module.exports = Usuario;