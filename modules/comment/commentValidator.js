const { body, validationResult } = require('express-validator');
const { VALIDATION } = require('../../config/constants');

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    const firstError = errors.array()[0].msg;
    const error = new Error(firstError);
    error.status = 400;
    error.errors = errors.array();
    throw error;
};

exports.commentValidator = [
    body('content')
        .notEmpty().withMessage('O comentário não pode ser vazio.')
        .isLength({ max: VALIDATION.COMMENT_MAX })
        .withMessage(`O comentário deve ter no máximo ${VALIDATION.COMMENT_MAX} caracteres.`)
        .trim(),
    validate
]; 