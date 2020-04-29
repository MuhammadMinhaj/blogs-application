const User = require('../models/User')
exports.bindUserWithRequiest = ()=>{
    return async (req,res,next)=>{
        if(!req.session.isLoggedIn){
            return next()
        }
        try{
            let user =await User.findOne(req.session.user._id)
            req.user = user
            next()
        }catch(err){
            console.log(err)
            next(err)
        }
    }
}
exports.isAuthenticated = (req,res,next)=>{
    if(!req.session.isLoggedIn){
        return res.redirect('/auth/login')
    }
   next()
}
exports.isUnAthenticated = (req,res,next)=>{
    if(req.session.isLoggedIn){
        return res.redirect('/dashboard')
    }
    next()
}