const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const Follow = sequelize.define('Follow', {
    followerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' }
    },
    followingId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' }
    }
}, {
    tableName: 'follows', timestamps: true,
    indexes: [
        // Garante que um usuário só pode seguir outro uma vez
        { unique: true, fields: ['follower_id', 'following_id'], name: 'idx_unique_follow' }
    ]
});
module.exports = Follow;