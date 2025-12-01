const Sequelize = require('sequelize');
const database = require('../config/database');
const Rastreador = require('./rastreador');

// [Diagrama de Classes] Entidade: Manutencao
const Manutencao = database.define('manutencao', {
    id: { 
        type: Sequelize.INTEGER, 
        autoIncrement: true, 
        primaryKey: true 
    },
    
    // Atributos definidos no diagrama
    descricao: { type: Sequelize.STRING, allowNull: false },
    data: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    tecnico: { type: Sequelize.STRING } // [RN05] Técnico Responsável Obrigatório
});

// [Diagrama de Classes] Relacionamento: "possui" (1 para N)
Manutencao.belongsTo(Rastreador);
Rastreador.hasMany(Manutencao);

module.exports = Manutencao;