const express = require("express");
const router = express.Router();
const commentController = require("./commentController");
const authMiddleware = require("../../middlewares/auth");

// Rota para adicionar um novo comentário a um vídeo
router.post("/video/:videoId/comment", authMiddleware, commentController.addComment);

// Rota para buscar todos os comentários de um vídeo
router.get("/video/:videoId/comments", authMiddleware, commentController.getComments);

module.exports = router;