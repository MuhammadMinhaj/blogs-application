const Flash = require('../utils/Flash')
const Profile = require('../models/Profile')
const User = require('../models/User')
const Comment = require('../models/Comment')
const { validationResult } = require('express-validator')
const errorFormatter = require('../utils/validationErrorFormatter')
exports.dashboardGetController =async (req,res,next)=>{
    try{
        let profile = await Profile.findOne({user:req.user._id})
            .populate({
                path:'posts',
                select:'title thumbnail'
            })
            .populate({
                path:'bookmarks',
                select:'title thumbnail'
            })
        if(profile){
           return  res.render('pages/dashboard/dashboard',
           {
               title:'Dashboard',
               flashMessage:Flash.getMessage(req),
               posts:profile.posts.reverse().slice(0,3),
               bookmarks:profile.bookmarks.reverse().slice(0,3)
            })
        }
         res.redirect('/dashboard/create-profile')
         
    }catch(e){
        next(e)
    }  
}
exports.createProfileGetController =async (req,res,next)=>{
        try{
            let profile = await Profile.findOne({user:req.user._id})
            if(profile){
                res.redirect('/dashboard/edit-profile')
            }
            res.render('pages/dashboard/create-profile',{
                title:'Create Your Profile',
                flashMessage:Flash.getMessage(req),
                error:{}
            
            })
    
        }catch(e){
            next(e)
        }
}
exports.createProfilePostController =async (req,res,next)=>{
            
        let error = validationResult(req).formatWith(errorFormatter)
        if(!error.isEmpty()){
            return res.render('pages/dashboard/create-profile',
            {
                title:'Created User Profile',
                flashMessage:Flash.getMessage(req),
                error:error.mapped()
            }
            )
        }
        let {
            name,
            title,
            bio,
            website,
            facebook,
            twitter,
            github
        } = req.body
        let profilePics = req.user.profilePics
        let userId = req.user._id
        try{
            let profile = new Profile({
                user:userId,
                name,
                title,
                bio,
                profilePics,
                links:{
                    website:website||'',
                    facebook:facebook||'',
                    twitter:twitter||'',
                    github:github||''
                },
                posts:[],
                bookmarks:[]
            })
            let createdProfile = await profile.save()

            await User.findOneAndUpdate(
                {_id:userId},
                {$set:{profile:createdProfile._id}}
            )

        req.flash('success','Successfully Created User Profile')
        res.redirect('/dashboard')

        }catch(e){
            next(e)
        }

}       
exports.editProfileGetController =async (req,res,next)=>{
    let username = req.user.username
    let profile = await Profile.findOne({user:req.user._id})
    if(!profile){
        return res.redirect('/dashboard/create-profile')
    }
    req.flash('success','Edit Your Profile')
    res.render('pages/dashboard/edit-profile',
        {
            title:'Edit Your Profile',
            error:{},
            profile,
            flashMessage:Flash.getMessage(req),
            username
        }
    )


    
}
exports.editProfilePostController =async (req,res,next)=>{
    let username = req.user.username
    let error = validationResult(req).formatWith(errorFormatter)
    let {
       
        name,
        title,
        bio,
        website,
        facebook,
        twitter,
        github
    } = req.body

    
    if(!error.isEmpty()){
        return res.render('pages/dashboard/edit-profile',
        {
            title:'Edit Profile',
            flashMessage:Flash.getMessage(req),
            profile:{
                name,
                title,
                bio,
                links:{
                    website,
                    facebook,
                    twitter,
                    github
                }
            },
            error:error.mapped(),
            username

        }
        )
    }
    try{
        let profile = {
            profilePics:req.user.profilePics,
            name,
            title,
            bio,
            links:{
                website:website||'',
                facebook:facebook||'',
                twitter:twitter||'',
                github:github||'',
            }
        }
        let updatedProfile = await Profile.findOneAndUpdate(
            {user:req.user._id},
            {$set:profile},
            {new:true}
            )
        req.flash('success','Successfully Updated Your Profile')
        res.render('pages/dashboard/edit-profile',{
            title:'Edit Profile',
            flashMessage:Flash.getMessage(req),
            error:{},
            profile:updatedProfile,
            username
        })

    }catch(e){
        next(e)
    }
}

exports.bookmarksGetController = async (req,res,next)=>{
    try{
        let profile = await Profile.findOne({user:req.user._id})
        .populate({
            path:'bookmarks',
            model:'Post',
            select:'title thumbnail'
        })
        res.render('pages/dashboard/bookmarks',{
            title:'Bookmarks List',
            flashMessage:Flash.getMessage(req),
            bookmarks:profile.bookmarks
        })
    }catch(e){
        next(e)
    }
}
exports.commentsGetController = async (req,res,next)=>{
    try{    
        let profile = await Profile.findOne({user:req.user._id})
        let comments = await Comment.find({post:{$in:profile.posts}})
            .populate({
                path:'post',
                select:'title'
            })
            .populate({
                path:'user',
                select:'username profilePics'
            })
            .populate({
                path:'replies.user',
                select:'username profilePics'
            })

            // res.json(comments)
            res.render('pages/dashboard/comments',{
                title:"My Recent Comments",
                flashMessage:Flash.getMessage(req),
                comments
            })
    }catch(e){
        next(e)
    }
}