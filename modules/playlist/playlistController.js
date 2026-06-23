const playlistService = require("./playlistService");
const asyncHandler = require("../../middlewares/asyncHandler");
const { validationResult } = require("express-validator");

exports.createPlaylist = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash("error", errors.array().map(err => err.msg));
        return res.redirect("back");
    }
    const { title, description, isPublic } = req.body;
    const userId = req.session.user.id;
    await playlistService.createPlaylist(userId, title, description, isPublic === "on");
    req.flash("success", "Playlist criada com sucesso!");
    res.redirect("/my-playlists");
});

exports.renderMyPlaylists = asyncHandler(async (req, res) => {
    const userId = req.session.user.id;
    const playlists = await playlistService.getUserPlaylists(userId);
    res.render("my-playlists", { title: "Minhas Playlists", playlists });
});

exports.renderPlaylistDetails = asyncHandler(async (req, res) => {
    const playlistId = req.params.id;
    const userId = req.session.user ? req.session.user.id : null;
    const playlist = await playlistService.getPlaylistById(playlistId, userId);
    res.render("playlist", { title: playlist.title, playlist });
});

exports.addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.body;
    const userId = req.session.user.id;
    const result = await playlistService.addVideoToPlaylist(playlistId, videoId, userId);
    if (req.xhr || (req.headers.accept && req.headers.accept.indexOf("json") > -1)) {
        return res.status(200).json({ success: result.success, message: result.message });
    } else {
        req.flash(result.success ? "success" : "error", result.message);
        res.redirect("back");
    }
});

exports.removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.body;
    const userId = req.session.user.id;
    await playlistService.removeVideoFromPlaylist(playlistId, videoId, userId);
    req.flash("success", "Vídeo removido da playlist com sucesso!");
    res.redirect("back");
}); 

exports.deletePlaylist = asyncHandler(async (req, res) => {
    const playlistId = req.params.id;
    const userId = req.session.user.id;
    await playlistService.deletePlaylist(playlistId, userId);
    req.flash("success", "Playlist excluída com sucesso!");
    res.redirect("/my-playlists");
});

exports.getPlaylistsForVideo = asyncHandler(async (req, res) => {
    const userId = req.session.user.id;
    const videoId = req.params.videoId;
    const playlists = await playlistService.getUserPlaylistsWithVideoStatus(userId, videoId);
    res.status(200).json({ playlists });
});