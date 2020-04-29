const { body } = require('express-validator')
const validator = require('validator')

const linkValidator = value=>{
    if(value){
        if(!validator.isURL(value)){
            throw new Error('Please provied valid URL')
        }
    }
    return true
}
module.exports = [
    body('name')
        .not().isEmpty().withMessage('Please Type you ')
        .isLength({min:3,max:20}).withMessage('Name must be 3 chars to 30 chars length')
        .trim()
        ,
    body('title')
        .not().isEmpty().withMessage('Please type a short titile')
        .isLength({max:100}).withMessage('Titile Max length 100 chars')
        .trim()
        ,
    body('bio')
        .not().isEmpty().withMessage('Please provied Your Bio')
        .isLength({max:500}).withMessage('Max 100 chars for BIO')
        .trim()
        ,
    body('website')
        .custom(linkValidator)
        ,
    body('facebook')
        .custom(linkValidator)
        ,
    body('twitter')
        .custom(linkValidator)
        ,
    body('github')
        .custom(linkValidator)
]