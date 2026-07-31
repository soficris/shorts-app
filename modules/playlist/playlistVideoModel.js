const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const PlaylistVideo = sequelize.define("PlaylistVideo", {
    playlistId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "playlists", key: "id" }
    },
    videoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "videos", key: "id" }
    }
}, {
    tableName: "playlist_videos",
    timestamps: false,
    indexes: [
        { unique: true, fields: ["playlist_id", "video_id"], name: "idx_unique_playlist_video" }
    ]
}); 

module.exports = PlaylistVideo;