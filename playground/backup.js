const router = require('express').Router();
const { check,validationResult } = require('express-validator');

const Flash = require('../utils/Flash')




router.get('/validator',(req,res,next)=>{
    // console.log(Flash.getMessage(req))
    // console.log(req.flash('fail'))
    // console.log(req.flash('success'))
    console.log(Flash.getMessage(req))
    res.render('playground/singup',{title:'Validator Playground'})

})


router.post('/validator',
    [
        // Validated Username
    check('username')
        .not()
        .isEmpty()
        .withMessage('Please provied your valid Username')
        .isLength({max:15})
        .withMessage('Max username is 15 cheracters'),
        // Validated Email
    check('email')
        .not()
        .isEmpty()
        .withMessage('Please Provied your Email')
        .isEmail()
        .withMessage('Please Provied your Valid Email'),
    check('password').custom(value=>{
            if(value.length<6){
                throw new Error('Must be password 6 character gther then ')
            };
            return true
        }),
    check('confirmPassword').custom((value,{req})=>{
        if(value !== req.body.passowrd){
            throw new Error('Passowrd Dosen\'t match')
        }
        return true
    })

    ],
(req,res,next)=>{
    let error = validationResult(req);
    // let formatter = err=>err.msg;
    // let final = error.formatWith(formatter).mapped()
    // console.log(final)
    // console.log(error.isEmpty())
    // if(!error.isEmpty()){
    //     req.flash('faile','There is Some error')
    // }else{
    //     req.flash('success','There is Not Error')
    // }
    

    let test = true;
    if(test){
        req.flash('success','There is Successful')
    }else{
        req.flash('fail','There some Error Founded')
    }
res.redirect('/playground/validator')
    // res.render('playground/singup',{title:'Rediriect Page'})
})



module.exports = router;