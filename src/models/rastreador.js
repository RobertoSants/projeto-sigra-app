const Sequelize = require('sequelize');
const database = require('../config/database');

// [Diagrama de Classes] Entidade Rastreador
const Rastreador = database.define('rastreador', {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    
    // [RN01] Identificação única
    imei: { type: Sequelize.STRING, allowNull: false, unique: true },

    // [NOVO] Detalhamento Técnico do Equipamento (Solicitado na melhoria)
    fabricante: { type: Sequelize.STRING }, // Ex: Queclink, SunTech
    modelo: { type: Sequelize.STRING, allowNull: false }, // Ex: GV75, GV50
    
    // [NOVO] Controle de Chip (Sim Card)
    operadora: { type: Sequelize.STRING }, // Ex: Claro, Vivo
    numero_chip: { type: Sequelize.STRING }, 
    linha_chip: { type: Sequelize.STRING }, // ICCID ou linha
    
    // Status (Atualizado automaticamente pelos Controllers)
    status: { type: Sequelize.STRING, defaultValue: 'Em Estoque' }
});

module.exports = Rastreador;