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

module.exports = router;
