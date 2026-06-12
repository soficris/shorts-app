const { body, validationResult } = require('express-validator');
const { VALIDATION } = require('../../config/constants');

/**
 * Middleware para verificar os resultados da validação.
 * Se houver erros, lança uma exceção que será capturada pelo errorHandler.
 */
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

exports.registerValidator = [
    body('username')
        .isLength({
            min: VALIDATION.USERNAME_MIN,
            max: VALIDATION.USERNAME_MAX
        })
        .withMessage(
            `O nome de usuário deve ter entre ${VALIDATION.USERNAME_MIN} e ${VALIDATION.USERNAME_MAX} caracteres.`
        )
        .trim(),

    body('email')
        .isEmail()
        .withMessage('Por favor, insira um e-mail válido.')
        .normalizeEmail(),

    body('password')
        .isLength({ min: VALIDATION.PASSWORD_MIN })
        .withMessage(
            `A senha deve ter pelo menos ${VALIDATION.PASSWORD_MIN} caracteres.`
        ),

    body('confirmPassword')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('As senhas não coincidem.');
            }

            return true;
        }),

    body('fullName')
        .notEmpty()
        .withMessage('O nome completo é obrigatório.')
        .trim(),

    validate
];

exports.loginValidator = [
    body('login')
        .notEmpty()
        .withMessage('O e-mail ou usuário é obrigatório.')
        .trim(),

    body('password')
        .notEmpty()
        .withMessage('A senha é obrigatória.')
        .trim(),

    validate
];

exports.profileUpdateValidator = [
    body('fullName')
        .notEmpty()
        .withMessage('O nome completo não pode ser vazio.')
        .trim(),

    body('bio')
        .optional({ checkFalsy: true })
        .isLength({ max: VALIDATION.DESCRIPTION_MAX })
        .withMessage(
            `A bio deve ter no máximo ${VALIDATION.DESCRIPTION_MAX} caracteres.`
        )
        .trim(),

    validate
];