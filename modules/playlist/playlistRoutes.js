const express = require("express");
const router = express.Router();
const playlistController = require("./playlistController");
const playlistValidator = require("./playlistValidator");
const { isAuthenticated } = require("../../middlewares/auth");

// Rotas para Playlists
router.get("/my-playlists", isAuthenticated, playlistController.renderMyPlaylists);

router.get("/playlist/:id", isAuthenticated, playlistController.renderPlaylistDetails);

router.post("/playlist", isAuthenticated, playlistValidator.createPlaylist, playlistController.createPlaylist);

router.post("/playlist/add-video", isAuthenticated, playlistController.addVideoToPlaylist);

router.post("/playlist/remove-video", isAuthenticated, playlistController.removeVideoFromPlaylist);

router.post("/playlist/:id/delete", isAuthenticated, playlistController.deletePlaylist);

module.exports = router;