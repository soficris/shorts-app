var express = require('express');
var router = express.Router();


//Rota para a página inicial (landing page)
router.get('/', function(req, res, next) { //se o roteador receber uma requisição do tipo GET para a raiz
  res.render('landing', { title: 'Vídeos Curtos e Engajadores' }); //renderiza a landing.ejs, passando um objeto com a propriedade title
});
// quando acontecer uma requisição get, com os objetos req (tem informações sobre a requisição), 
// res (tem métodos para enviar resposta) e next (função para passar controle para o próximo middleware), 
// responda, renderizando a pagina landing e passando um título para a view.


module.exports = router;
