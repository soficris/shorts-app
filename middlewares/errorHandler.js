module.exports = (err, req, res, next) => {
    console.error('--- Erro Capturado pelo Handler Central ---');
    console.error(err);

    const statusCode = err.status || 500;
    const message = err.message || 'Ocorreu um erro interno no servidor.';
    
    // Se for uma requisição AJAX ou API (espera JSON)
    if (req.xhr || (req.headers.accept && req.headers.accept.indexOf('json') > -1)) {
        return res.status(statusCode).json({
            success: false,
            message: message,
            errors: err.errors || []
        });
    }

    // Se for uma requisição de navegação normal (espera HTML)
    req.flash('error', message);
    
    // Tenta redirecionar para a página anterior ou para o feed como fallback
    const backURL = req.header('Referer') || '/feed';
    res.redirect(backURL);
};