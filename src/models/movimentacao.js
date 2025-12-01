const Sequelize = require('sequelize');
const database = require('../config/database');
const Rastreador = require('./rastreador');
const Cliente = require('./cliente'); // [NOVO] Importa Cliente

// [Diagrama de Classes] Entidade Movimentacao
const Movimentacao = database.define('movimentacao', {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    tipo: { type: Sequelize.STRING, allowNull: false },
    data: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    
    // [NOVO] Lógica de Destino Híbrida
    // Se for SAÍDA para cliente, usamos o ID do Cliente.
    // Se for TRANSFERÊNCIA interna, usamos texto livre.
    origem_texto: { type: Sequelize.STRING }, 
    destino_texto: { type: Sequelize.STRING },
    
    responsavel: { type: Sequelize.STRING }
});

// Relacionamentos
Movimentacao.belongsTo(Rastreador);
Rastreador.hasMany(Movimentacao);

// [NOVO] Relacionamento com Cliente (Opcional, pois nem toda mov. é para cliente)
Movimentacao.belongsTo(Cliente); 

module.exports = Movimentacao;