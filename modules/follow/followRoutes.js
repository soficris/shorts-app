const express = require("express");
const router = express.Router();
const followController = require("./followController");
const { isAuthenticated } = require("../../middlewares/auth");

// Rota para alternar o seguimento (seguir/deixar de seguir) de um usuário
router.post("/user/:userId/toggle-follow", isAuthenticated, followController.toggleFollow);

// Rota para verificar o status de seguimento de um usuário para o usuário logado
router.get("/user/:userId/follow-status", isAuthenticated, followController.getFollowStatus);

// Rotas para listar seguidores e quem o usuário segue
router.get("/user/:userId/followers", isAuthenticated, followController.renderFollowers);
router.get("/user/:userId/following", isAuthenticated, followController.renderFollowing);

module.exports = router;