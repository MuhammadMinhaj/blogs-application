const Flash = require('../utils/Flash')
const { validationResult } = require('express-validator')
const errorFormatter = require('../utils/validationErrorFormatter')
const readingTime = require('reading-time')
const Post = require('../models/Post')
const Profile = require('../models/Profile')

exports.createPostGetController = (req, res, next) => {
    res.render('pages/dashboard/post/create-post',{
        title:'Create Your Post',
        flashMessage:Flash.getMessage(req),
        error:{},
        value:{}
    })
}
exports.createPostPostController = async (req, res, next) => {
    let { title,body,tags } = req.body
   
    let errors = validationResult(req).formatWith(errorFormatter)
    if(!errors.isEmpty()){
        return res.render('pages/dashboard/post/create-post',
        {
            title:'Error Occurred',
            flashMessage:Flash.getMessage(req),
            error:errors.mapped(),
            value:{
                title,
                body,
                tags
            }
        }
        )
    }

    // if(tags){
    //     let tags = tags.split(',')

    // }
    let readTime = readingTime(body).text;

    let post = new Post({
        title,
        body,
        author:req.user._id,
        tags:tags?tags.split(','):{},
        thumbnail:req.file?`/uploads/${req.file.filename}`:'',
        readTime,
        likes:[],
        dislikes:[],
        comments:[]
    })
    // if(req.file){
    //     post.thumbnail = `/uploads/${req.file.filename}`
    // }
    try{
      let createdPost = await post.save()
        
      await Profile.findOneAndUpdate(
          {user:req.user._id},
          {$push:{'posts':createdPost._id}}
        )
        req.flash('success','Successfully Created Post')
        return res.redirect(`/posts/edit/${createdPost._id}`)
    }catch(e){
        next(e)
    }
       
}
exports.editPostGetController = async ( req, res, next ) => {
    let postId = req.params.postId
    let userId = req.user._id;
    try{    
        let post = await Post.findOne({author:userId,_id:postId})
        if(!post){
            let error = new Error('404 Page Not Found')
            error.status(404)
            throw error
        }
        res.render('pages/dashboard/post/edit-post',{
            title:'Edit Post',
            error:{},
            post,
            flashMessage:Flash.getMessage(req)

        })

    }catch(e){
        next(e)
    }
}
exports.editPostPostController = async (req,res,next) => {
    let { title,body,tags } = req.body 
    let postId = req.params.postId;
    let userId = req.user._id;
    try{
    let post = await Post.findOne({_id:postId,author:userId})
    if(!post){
        let error = new Error('404 Page Not Found')
        error.status(404)
        throw error
    }
    let error = validationResult(req).formatWith(errorFormatter)
    if(!error.isEmpty()){
        return res.render('pages/dashboard/post/edit-post',{
            title:'Edit Your Post',
            error:error.mapped(),
            flashMessage:Flash.getMessage(req),
            post

        })
    }
    let tag = tags?tags.split(', ').map(t=>t.trim()):'';

    let thumbnail = post.thumbnail;
    req.file?thumbnail = req.file.filename:thumbnail;
    
    await Post.findOneAndUpdate(
        {_id:post._id},
        {$set:{
            title,
            body,
            tags:tag,
            thumbnail:`/uploads/${thumbnail}`
        }},
        {new:true}
    )
    req.flash('success','Post Updated Successful')
    return res.redirect('/posts/edit/'+post._id)
    
    }catch(e){
        next(e)
    }
}
exports.deletePostGetController = async (req,res,next) => {
    let { postId } = req.params
    try{
        let post = await Post({author:req.user._id,_id:postId})
        if(!post){
            let error = new Error('404 Page Not Found')
            error.status(404)
            throw error
        }
        await Post.findOneAndDelete({_id:postId}) 
        await Profile.findOneAndUpdate({_id:req.user._id},{$pull:{'posts':postId}})   
        req.flash('success','Successfully Post Deleted')
        res.redirect('/posts')   

    }catch(e){
        next(e)
    }
}
exports.getAllPostController = async (req,res,next)=>{
    let userId = req.user._id
    try{
        let posts = await Post.find({author:userId})
        return res.render('pages/dashboard/post/posts',
        {
            title:'My All Created Post',
            posts,
            flashMessage:Flash.getMessage(req)
            
        }
        )
    }catch(e){
        next(e)
    }
}