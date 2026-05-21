const {DataTypes} = require('sequelize'); 
const sequelize = require("../../config/database"); 

const Like = sequelize.define('Like', {
    id:         { type: DataTypes.INTEGER, autoIncrement:true, primaryKey: true },
    userId:     { type: DataTypes.INTEGER, allowNull: false, references: { model: "users", key: "id" } },
    videoId:    { type: DataTypes.INTEGER, allowNull: false, references: { model: "videos", key: "id" } }
    }, 
    {
        tableName: "likes",
        timestamps: true,
        indexes: [
            { fields: ['user_id', 'video_id'], unique: true, name: 'idx_unique_like' } // Garante que um usuário só pode curtir um vídeo uma vez
        ]
    }
); 

module.exports = Like; 