const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Comment = sequelize.define("Comment", 
    {
        id:         { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        content:    { type: DataTypes.TEXT, allowNull: false },
        userId:     { type: DataTypes.INTEGER, allowNull: false, references: { model: "users", key: "id" } },
        videoId:    { type: DataTypes.INTEGER, allowNull: false, references: { model: "videos", key: "id" } }
    }, 
    {
        tableName: "comments",
        timestamps: true
    }
);

module.exports = Comment;