const { body } = require('express-validator') 
const cheerio = require('cheerio')
module.exports = [
    body('title')
        .not().isEmpty().withMessage('Title Can Not Be Empty')
        .isLength({max:100}).withMessage('Title Can Not Be Gater Then 100 Cahrs')
        .trim()
        ,
    body('body')
        .not().isEmpty().withMessage('Post Body Can Not Be Empty')
        .custom(value=>{
            let $ = cheerio(value)
            let text = $.text()
            if(text.length>5000){
                throw new Error('Post Body Can Not Be Greater Then 5000 Chars')
            }
            return true
        })
    ]
    