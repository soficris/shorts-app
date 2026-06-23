const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Playlist = sequelize.define("Playlist", {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: "O título da playlist não pode ser vazio." },
            len: { args: [3, 100], msg: "O título da playlist deve ter entre 3 e 100 caracteres." }
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    isPublic: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    videosCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false, references: { model: "users", key: "id" }
    }
}, {
    tableName: "playlists",
    timestamps: true
});

module.exports = Playlist;