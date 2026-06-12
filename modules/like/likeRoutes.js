const express = require("express");
const router = express.Router();
const likeController = require("./likeController");
const { isAuthenticated } = require("../../middlewares/auth");
const asyncHandler = require("../../middlewares/asyncHandler");

// Rota para alternar o like (curtir/descurtir)
router.post("/video/:videoId/toggle-like", isAuthenticated, asyncHandler(likeController.toggleLike));

// Rota para verificar o status do like de um vídeo para o usuário logado
router.get("/video/:videoId/like-status", isAuthenticated, asyncHandler(likeController.checkLikeStatus));

module.exports = router; 