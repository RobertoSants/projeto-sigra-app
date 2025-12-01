const Sequelize = require('sequelize');

// Configuração do Banco de Dados SQLite
// Escolhido pela facilidade de portabilidade (arquivo local)
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite', // O arquivo que guarda os dados
    logging: false // Desabilita logs técnicos no terminal (opcional)
});

module.exports = sequelize;