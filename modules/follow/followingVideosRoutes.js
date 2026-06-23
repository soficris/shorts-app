const express = require("express");
const router = express.Router();
const followingVideosController = require("./followingVideosController");
const { isAuthenticated } = require("../../middlewares/auth");

// Rota para a página de vídeos de usuários seguidos [ADICIONAR]
router.get("/following-videos", isAuthenticated, followingVideosController.renderFollowingVideos);

module.exports = router;