module.exports = (err, req, res, next) => {
    const status = err.status || 500;
    const acceptsJson = req.headers.accept && req.headers.accept.indexOf("json") > -1;

    console.error(err);

    if (acceptsJson) {
        return res.status(status).json({ error: err.message || "Erro interno do servidor." });
    }

    res.status(status).render("error", {
        title: status === 404 ? "Página não encontrada" : "Erro",
        message: err.message || "Ocorreu um erro inesperado.",
        status
    });
}