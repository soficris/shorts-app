const { body } = require("express-validator");

exports.createPlaylist = [
    body("title")
        .trim()
        .notEmpty().withMessage("O título da playlist é obrigatório.")
        .isLength({ min: 3, max: 100 }).withMessage("O título da playlist deve ter entre 3 e 100 caracteres."),
    body("description")
        .trim()
        .isLength({ max: 500 }).withMessage("A descrição da playlist não pode exceder 500 caracteres.")
];