const express = require("express");
const router = express.Router();
const commentController = require("./commentController");
const {commentValidator} = require("./commentValidator");

const {isAuthenticated} = require("../../middlewares/auth");

const asyncHandler = require("../../middlewares/asyncHandler"); 

// Rota para adicionar um comentário - // Adicionado validator e asyncHandler
router.post("/video/:videoId/comment", isAuthenticated, commentValidator, asyncHandler(commentController.addComment));

// Rota para buscar comentários de um vídeo - // Adicionado asyncHandler
router.get("/video/:videoId/comments", isAuthenticated, asyncHandler(commentController.getComments));

module.exports = router;