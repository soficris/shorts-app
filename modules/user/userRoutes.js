var express = require("express");
var router = express.Router();
const userController = require("./userController");
const { registerValidator, loginValidator, profileUpdateValidator } = require("./userValidator");
const {isAuthenticated} = require("../../middlewares/auth");
const profileMulter = require("../../middlewares/profileMulter");
const asyncHandler = require("../../middlewares/asyncHandler");


// Rota para exibir o formulário de cadastro
router.get("/register", userController.renderRegisterForm);

// Rota que processa o formulário de cadastro
router.post("/register", registerValidator, asyncHandler(userController.register));

// Rota para exibir o formulário de login
router.get("/login", userController.renderLoginForm);

// Rota para processar o formulário de login
router.post("/login", loginValidator, asyncHandler(userController.login));

// Rota para processar o logout
router.get("/logout", userController.logout);

// Rota para exibir o perfil do usuário (protegida por autenticação)
router.get("/profile/edit", isAuthenticated, asyncHandler(userController.renderEditProfile));

// Rota de atualização (Protegida + Upload de 1 arquivo chamado 'profilePicture')
router.post("/profile/edit", isAuthenticated, profileMulter.single("profilePicture"), profileUpdateValidator, asyncHandler(userController.updateProfile));

// [ADICIONAR] Rota para exibir o perfil público de um usuário
router.get("/profile/:username", isAuthenticated, asyncHandler(userController.renderPublicProfile)); 

// Rota para exibir o feed de vídeos (protegida por autenticação)
router.get("/feed", isAuthenticated, userController.renderFeed);

module.exports = router;