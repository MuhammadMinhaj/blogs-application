const { body } = require('express-validator');
const User = require('../../models/User');

const singupValidator = [
    body('username')
        .not()
        .isEmpty()
        .withMessage('Please provied your username.')
        .isLength({ min: 4, max: 15 })
        .withMessage('Username must be min 4 chers to max 16 chers.')
        .custom(async username => {
        let user = await User.findOne({ username });
        if (user) {
            return Promise.reject('Already Username Used.');
        }
        return true;
        })
        .trim(),
    body('email')
        .not()
        .isEmpty()
        .withMessage('Please provied Your email')
        .isEmail()
        .withMessage('Please provied a valid email')
        .custom(async email=>{
            let user = await User.findOne({email})
            if(user){
                return Promise.reject('Already Email Used')
            }
            return true
        })
        .normalizeEmail(),
    body('password')
        .not()
        .isEmpty()
        .withMessage('Please provied Password')
        .isLength({min:6})
        .withMessage('Must be min 6 chars Password'),
    body('confirmPassword')
        .not()
        .isEmpty()
        .withMessage('Please Provied Confirm Password')
        .isLength({min:6})
        .withMessage('Must be min 6 chars confirm Password')
        .custom((confirmPassword,{req})=>{
            
            if(confirmPassword !== req.body.password){
                 throw new Error('Password dosen\'t match')
            }
            return true
        })

];
module.exports = singupValidator;