const {Sequelize} = require('sequelize')  //criou uma classe chamada Sequelize,usada para criar uma instância de conexão com o banco de dados.
require('dotenv').config()

const sequelize = new Sequelize( //metodo construtor
    process.env.DB_NAME, 
    process.env.DB_USER,
    process.env.DB_PASSWORD, 
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'mysql', 
        logging : false,  //se deixar true, mostra no sql o que ta sendo executado
        define : {
            timestamps : true, //toda tabela vai ter os campos createdAt e updatedAt
            underscored : true //toda tabela vai ter os campos com underline, ex: created_at e updated_at
        }
    }
); //o 4 parametro é sempre um json de informações do servidor


module.exports = sequelize; //o objeto sequelize pode ser acessável por outros arquivos