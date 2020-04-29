const bcrypt = require('bcrypt')
const { validationResult } = require('express-validator')
const errorFormatter = require('../utils/validationErrorFormatter')
const User = require('../models/User');
const Flash = require('../utils/Flash')


exports.singupGetController = (req,res,next)=>{
    res.render('pages/auth/singup',
        {title:'Create A New Account',
        error:{},
        value:{},
        flashMessage:Flash.getMessage(req)
    })
}

exports.singupPostController = async  (req,res,next)=>{
    let { username,email,password, } = req.body;
    let errors = validationResult(req);
    let result = errors.formatWith(errorFormatter)
 
    if(!result.isEmpty()){ 
        req.flash('fail','Please check your form')
        let error = result.mapped()
        return res.render('pages/auth/singup',{
            title:'Create New Account',
            error,
            value:{
                username,
                email,
                password
            },
            flashMessage:Flash.getMessage(req)
        })
    }

   

   try{
        let hashed = await bcrypt.hash(password,11)
        let user = new User({
            username,
            email,
            password:hashed
        })
        await user.save()
       
        req.flash('success','User Created Successfully')
        res.redirect('/auth/login')
        

   }catch(err){
        console.log(`Error Occurred : ${err}`)
        next(err)
   }
}

exports.loginGetController = (req,res,next)=>{

    // console.log(req.get('Cookie'))
    // console.log(req.session.user)
    // console.log(req.session.isLoggedIn)
    // console.log(req.user)

    res.render('pages/auth/login',{
        title:'Login Account',
        error:{},
        flashMessage:Flash.getMessage(req)
})

}

exports.loginPostController = async (req,res,next)=>{
    let { email,password } = req.body 
    let errors = validationResult(req)
    let resultError = errors.formatWith(errorFormatter)

    if(!resultError.isEmpty()){
        req.flash('fail','Login Filed')
        let error = resultError.mapped()
        return res.render('pages/auth/login',{
            title:'Now Login Account',
            error,
            flashMessage:Flash.getMessage(req)
        })
    }

    try{
        let user = await User.findOne({email:email})

        if(!user){
            req.flash('fail','Please provide valid Information')
            return res.render('pages/auth/login',{
                title:'Login to Your Account',
                error:{},
                flashMessage:req.flash(req)
            })
            
        }    
        let match = await bcrypt.compare(password,user.password);
        if(!match){
            req.flash('fail','Password Dosen\'t match')
           return res.render('pages/auth/login',{
                title:'Login to Your Account',
                error:{},
                flashMessage:req.flash(req)
            })
        }
        // console.log(`Successfully Logged in User : ${user}`)
      
        // res.setHeader('Set-Cookie','isLoggedIn=true')


        req.session.isLoggedIn = true
        req.session.user = user
        req.session.save(err=>{
            if(err){
                console.log(err)
                return next(err)
            }

            req.flash('success','Successfully Logged In')
            res.redirect('/dashboard')
        })

    }catch(err){
        console.log(err)
    }
    
}

exports.logoutController = (req,res,next)=>{
    
    req.session.destroy(err=>{
        if(err){
            console.log(err)
            return next(err)
        }

        res.redirect('/auth/login')
       
    })  
    
}
exports.changePasswordGetController = (req,res,next)=>{
    res.render('pages/auth/changePassword',{
        title:'Change Password',
        flashMessage:Flash.getMessage(req)
    })
}
exports.changePasswordPostController = async (req,res,next)=>{
    try{
        let { oldPassword,newPassword,confirmPassword } = req.body

        if(oldPassword.length===0 || newPassword.length===0 || confirmPassword.length===0){
            req.flash('fail','Can Not Empty Field')
            return res.redirect('/auth/change-password')
        }
        if(oldPassword.length<6|| newPassword.length<6 || confirmPassword.length<6){
            req.flash('fail','Password Must Be Greater Then 6 Chars')
            return res.redirect('/auth/change-password')
        }
        if(newPassword!==confirmPassword){
            req.flash('fail','Password Dosn\'t match')
            return res.redirect('/auth/change-password')
        }
        
        let match = await bcrypt.compare(oldPassword,req.user.password)
        console.log('Checked Now :'+match)
        if(!match){
            req.flash('fail','Invalid Old Password')
            return res.redirect('/auth/change-password')
        }
        let hash = await bcrypt.hash(newPassword,11)
        await User.findOneAndUpdate(
            {_id:req.user._id},
            {$set:{password:hash}}
        )
        req.flash('success','Successfully Updated Password')
        res.redirect('/auth/change-password')

    }catch(e){
        next(e)
    }
    

}