var express = require('express');
var router = express.Router();
const userController = require('../modules/user/userController');
const authMiddleware = require('../middlewares/auth'); //importa o middleware de autenticação
const upload = require('../middlewares/multer'); //importa o middleware de upload


/* GET home page. */
router.get('/', function(req, res, next) { //se o roteador receber uma requisição do tipo GET para a raiz
  res.render('index', { title: 'Bem vindo!' }); //renderiza a view index.ejs, passando um objeto com a propriedade title
});

//requisição GET para apresentar form de cadastro
router.get('/register', function(req, res, next){ // o /register é a rota 
  res.render('register', {title : 'Criar conta'});
});

//requisição POST para processar o form de cadastro
router.post('/register', userController.register); //ao receber uma rota POST para /register, o controlador userController irá processar a requisição usando a função register

//requisição GET para apresentar form de login
router.get('/login', (req, res) => {
  res.render('login', {title : 'Entrar'});
}); 

//requisição POST para processar o form de login
router.post('/login', userController.login); //ao receber uma rota POST para /login, o controlador userController irá processar a requisição usando a função login

//rota para processar logout
router.get('/logout', userController.logout); //ao receber uma rota GET para /logout, o controlador userController irá processar a requisição usando a função logout

// Rota para exibir o feed do usuário (protegido por autenticação)
router.get('/feed', authMiddleware, async (req, res) => {
    const user = await userController.getProfile(req.session.user.id);
    res.render('home', { user });
});

// Rota para exibir o perfil do usuario (protegido por autenticação)
router.get('/profile/edit', authMiddleware, async (req, res) => {
  const user = await userController.getProfile(req.session.user.id); //busca os dados do usuário logado usando o ID armazenado na sessão
  res.render('edit-profile', { user }); //renderiza a view editProfile.ejs, passando os dados do usuário para preencher o formulário
});

// Rota de atualização (Protegida + Upload de 1 arquivo chamado 'profilePicture')
router.post('/profile/edit', authMiddleware, upload.single('profilePicture'), userController.updateProfile);

module.exports = router;
