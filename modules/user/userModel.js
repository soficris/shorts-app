const {DataTypes} = require('sequelize');
const sequelize = require('../../config/database'); 

const User = sequelize.define( //o define quer receber uma string, uma entidade; uma coleção de campos
    'User', 
    {
        id : {
            type : DataTypes.INTEGER,
            primaryKey : true, 
            autoIncrement : true
        }, 
        username : {
            type : DataTypes.STRING(20),
            allowNull : false, // nome de usuario não pode ser nulo
            unique : true // nome de usuario deve ser único
        }, 
        email : {
            type : DataTypes.STRING, 
            allowNull : false,
            unique : true,
            validate : { isEmail : true }
        }, 
        password : {
            type : DataTypes.STRING,
            allowNull : false
        }, 
        fullName : {
            type : DataTypes.STRING(100),
            allowNull : false
        }, 
        profilePic : {
            type : DataTypes.STRING,
            allowNull : true
        }, 
        bio : {
            type : DataTypes.TEXT,
            allowNull : true,
            validate : { len : [0, 255]}
        }, 
        followersCount : {
            type : DataTypes.INTEGER,
            defaultValue : 0
        }, 
        followingCount : {
            type : DataTypes.INTEGER,
            defaultValue : 0
        }, 
        videosCount : {
            type : DataTypes.INTEGER,
            defaultValue : 0
        }, 
        isBlocked : {
            type : DataTypes.BOOLEAN,
            defaultValue : false
        }, 
        isAdmin : {
            type : DataTypes.BOOLEAN,
            defaultValue : false
        }
    }, 
    {
        timestamps : true, 
        tableName: 'users'
    }
);


module.exports = User; 