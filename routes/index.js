var express = require('express');
var router = express.Router();


//Rota para a página inicial (landing page)
router.get('/', function(req, res, next) { //se o roteador receber uma requisição do tipo GET para a raiz
  res.render('landing', { title: 'Vídeos Curtos e Engajadores' }); //renderiza a view index.ejs, passando um objeto com a propriedade title
});


module.exports = router;
