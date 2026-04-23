const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
const User = require("../user/userModel"); 

const Video = sequelize.define("Video", 
    {
        id:             { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        title:          { type: DataTypes.STRING(255), allowNull: false },
        description:    { type: DataTypes.TEXT, allowNull: true },
        videoPath:      { type: DataTypes.STRING(255), allowNull: false },
        thumbnailPath:  { type: DataTypes.STRING(255), allowNull: false },
        views:          { type: DataTypes.INTEGER, defaultValue: 0 },
        userId:         { type: DataTypes.INTEGER, allowNull: false, references: { model: User, key: "id" } } 
    }, 
    {
        tableName: "videos",
        timestamps: true,
        indexes: [
            { fields: ['user_id'], name: 'idx_videos_user_id' }  // nome fixo para o índice da FK
        ]
    }
);

// Define as associações
User.hasMany(Video, { foreignKey: "userId" }); // Um usuário pode ter muitos vídeos 
Video.belongsTo(User, { foreignKey: "userId" }); // Um vídeo pertence a um usuário 

module.exports = Video;