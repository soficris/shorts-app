var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) { //se o roteador receber uma requisição do tipo GET para a raiz
  res.render('index', { title: 'Bem vindo!' }); //renderiza a view index.ejs, passando um objeto com a propriedade title
});

//requisição GET para apresentar form de cadastro
router.get('/register', function(req, res, next){ // o /register é a rota 
  res.render('register', {title : 'Criar conta'});
});

const userController = require('../modules/user/userController');
//requisição POST para processar o form de cadastro
router.post('/register', userController.register); //ao receber uma rota POST para /register, o controlador userController irá processar a requisição usando a função register

//requisição GET para apresentar form de login
router.get('/login', (req, res) => {
  res.render('login', {title : 'Entrar'});
})


//requisição POST para processar o form de login
router.post('/login', userController.login); //ao receber uma rota POST para /login, o controlador userController irá processar a requisição usando a função login

//rota para processar logout
router.get('/logout', userController.logout); //ao receber uma rota GET para /logout, o controlador userController irá processar a requisição usando a função logout


const authMiddleware = require('../middlewares/auth'); //importa o middleware de autenticação

router.get('/feed', authMiddleware, async (req, res) => {
    const user = await userController.getProfile(req.session.user.id);
    res.render('home', { user });
});


module.exports = router;
