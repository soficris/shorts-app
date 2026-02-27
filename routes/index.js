var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) { //se o roteador receber uma requisição do tipo GET para a raiz
  res.render('index', { title: 'Bem vindo!' }); //renderiza a view index.ejs, passando um objeto com a propriedade title
});

router.get('/register', function(req, res, next){ // o /register é a rota 
  res.render('register', {title : 'Criar conta'});
});

module.exports = router;
