const Playlist = require("./playlistModel");
const PlaylistVideo = require("./playlistVideoModel");
const Video = require("../video/videoModel");
const User = require("../user/userModel");
const { Op } = require("sequelize");

async function createPlaylist(userId, title, description, isPublic) {
    const newPlaylist = await Playlist.create({
        userId,
        title,
        description,
        isPublic
    });
    return newPlaylist;
}

async function getUserPlaylists(userId) {
    const playlists = await Playlist.findAll({
        where: { userId },
        include: [{
            model: Video,
            attributes: ["id", "title", "thumbnailPath", "views"],
            through: { attributes: [] } // Não incluir a tabela de junção
        }],
        order: [["createdAt", "DESC"]]
    });
    return playlists;
}

async function getPlaylistById(playlistId, userId = null) {
    const playlist = await Playlist.findByPk(playlistId, {
        include: [
            { model: User, attributes: ["id", "username", "fullName"] },
            { model: Video, attributes: ["id", "title", "thumbnailPath", "views"], through: { attributes: [] } }
        ]
    });
    if (!playlist) {
        throw new Error("Playlist não encontrada.");
    }// Se a playlist não for pública e o usuário não for o dono, não permitir acesso
    if (!playlist.isPublic && (!userId || playlist.userId !== userId)) {
        throw new Error("Você não tem permissão para acessar esta playlist.");
    }
    return playlist;
}

async function addVideoToPlaylist(playlistId, videoId, userId) {
    const playlist = await Playlist.findByPk(playlistId);
    if (!playlist || playlist.userId !== userId) {
        throw new Error("Playlist não encontrada ou você não tem permissão.");
    }
    const video = await Video.findByPk(videoId);
    if (!video) {
        throw new Error("Vídeo não encontrado.");
    }
    const [playlistVideo, created] = await PlaylistVideo.findOrCreate({
        where: { playlistId, videoId },
        defaults: { playlistId, videoId }
    });
    if (created) {
        await playlist.increment("videosCount");
        return { success: true, message: "Vídeo adicionado à playlist com sucesso." };
    } else {
        return { success: false, message: "Vídeo já está nesta playlist." };
    }
}

async function removeVideoFromPlaylist(playlistId, videoId, userId) {
    const playlist = await Playlist.findByPk(playlistId); if (!playlist || playlist.userId !== userId) {
        throw new Error("Playlist não encontrada ou você não tem permissão.");
    }
    const deleted = await PlaylistVideo.destroy({
        where: { playlistId, videoId }
    });
    if (deleted) {
        await playlist.decrement("videosCount");
        return { success: true, message: "Vídeo removido da playlist com sucesso." };
    } else {
        throw new Error("Vídeo não encontrado nesta playlist.");
    }
}

async function deletePlaylist(playlistId, userId) {
    const playlist = await Playlist.findByPk(playlistId);
    if (!playlist || playlist.userId !== userId) {
        throw new Error("Playlist não encontrada ou você não tem permissão.");
    }
    await PlaylistVideo.destroy({ where: { playlistId } }); // Remove todos os vídeos da playlist
    await playlist.destroy(); // Remove a playlist
    return { success: true, message: "Playlist excluída com sucesso." };
}

module.exports = {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist, deletePlaylist
}