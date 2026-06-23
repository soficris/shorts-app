var createError = require('http-errors');
var express = require('express');
var expressLayouts = require('express-ejs-layouts'); 
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const flash = require('connect-flash'); 
const errorHandler = require('./middlewares/errorHandler'); 


var indexRouter = require('./routes/index');
var usersRouter = require('./modules/user/userRoutes');
var videoRoutes = require("./modules/video/videoRoutes"); // [ADICIONAR] Importa as rotas de vídeo
var likeRoutes = require("./modules/like/likeRoutes"); 
var commentRoutes = require("./modules/comment/commentRoutes"); 
var followRoutes = require("./modules/follow/followRoutes");
var playlistRoutes = require("./modules/playlist/playlistRoutes"); 
var followingVideosRoutes = require("./modules/follow/followingVideosRoutes"); 
var searchRoutes = require("./modules/search/searchRoutes"); 

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views/pages'));
app.set("layout", path.join(__dirname, "views/layouts/main")); 
app.use(expressLayouts); 
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(session ({
  secret : process.env.SESSION_SECRET || 'chave_super_secreta_nao_compartilhar', 
  resave : false,
  saveUninitialized : false, 
  cookie : {maxAge: 1000 * 60 * 60 * 24} 
}))

app.use(flash()); 
app.use((req, res, next) => {
  res.locals.messages = req.flash(); //cria uma variável local chamada messages que tem flash para serem usadas nas views
  res.locals.user = req.session.user || null; //cria uma variável local chamada user que tem o valor do usuário logado ou null se não tiver
  next();
});
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter); // se você receber chamado para a raiz do site, passe o controle para o indexRouter
app.use('/', usersRouter);  
app.use('/', videoRoutes); 
app.use('/', likeRoutes); 
app.use('/', commentRoutes); 
app.use('/', followRoutes); 
app.use('/', playlistRoutes); 
app.use('/', followingVideosRoutes); 
app.use('/', searchRoutes);

// Middleware de tratamento de erros centralizado
app.use(errorHandler);

require("./config/associations"); 

//testa a conexão com o mysql
const sequelize = require('./config/database'); //importa o objeto sequelize do arquivo database.js

sequelize.sync({alter :true}) //sincroniza os modelos com o banco de dados, criando as tabelas se necessário
  .then(() => console.log ('Sincronia realizada'))
  .catch(err => console.error('Erro de sincronia', err));


module.exports = app;
