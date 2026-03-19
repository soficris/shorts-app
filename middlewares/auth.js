module.exports = (req, res, next) => {
    if (req.session.user) {
        return next(); // Está logado, pode seguir
    }
    req.flash('error', 'Você precisa estar logado para acessar esta página.');
    res.redirect('/login');
};