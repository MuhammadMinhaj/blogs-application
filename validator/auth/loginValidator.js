const { body } = require('express-validator');
module.exports = [
    body('email')
        .not()
        .isEmpty()
        .withMessage('Please provied your correct email')
        .isEmail()
        .withMessage('Please provied valid email')
        .trim()
        .normalizeEmail(),
    body('password')
        .not()
        .isEmpty()
        .withMessage('Please provied your correct Password')
        .isLength()
        .withMessage('Must be min 6 chars password'),
        
]