var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//testa a conexão com o mysql
const sequelize = require('./config/database'); //importa o objeto sequelize do arquivo database.js
sequelize.sync({alter :true}) //sincroniza os modelos com o banco de dados, criando as tabelas se necessário
  .then(() => console.log ('Sincronia realizada'))
  .catch(err => console.error('Erro de sincronia', err));

/*
sequelize.authenticate() //se autenticar no servidor com as informações do database.js 
  .then(()=> console.log('Conexão com MySQL okay!') )
  .catch(err => console.error('Erro de conexão', err)); 
*/

module.exports = app;
