const {DataTypes} = require('sequelize');
const sequelize = require('../../config/database'); 

const User = sequelize.define(
    'User', 
    {
        id : {
            type : DataTypes.INTEGER,
            primaryKey : true, 
            autoIncrement : true
        }, 
        username : {
            type : DataTypes.STRING,
            allowNull : false, // nome de usuario não pode ser nulo
            unique : true // nome de usuario deve ser único
        }
    }
);


module.exports = User; 