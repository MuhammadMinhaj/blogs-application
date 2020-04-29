const moment = require('moment')
const Flash = require('../utils/Flash')
const Post = require('../models/Post')
const Profile = require('../models/Profile')

function genDate(days){
    let date = moment().subtract(days,'days')
    return date.toDate()
}

function genarateFilterObject(filter){
    let filterObj = {}
    let order = 1

    switch(filter){
        case 'week' : {
            filterObj= {
                createAt:{
                    $gt:genDate(7)
                }
            }
            order = -1
            break
        };
        case 'month' : {
            filterObj = {
                createAt:{
                    $gt:genDate(30)
                }
            }
            order = -1
            break
        }
        case 'all' : {
            order = -1
            break
        }
        
    }
    return {
        filterObj,
        order
    }

}

exports.explorerGetController = async (req,res,next)=>{

    let filter = req.query.filter||'latest'

    const correntPage = parseInt(req.query.page)||1

    const itemPerPage = 10;

    let { order,filterObj } = genarateFilterObject(filter.toLowerCase())

    try{
        let posts = await Post.find(filterObj)
        .populate('author','username')
        .sort(order===1?'createAt':'-createAt')
        .skip((itemPerPage*correntPage)-itemPerPage)
        .limit(itemPerPage)

        let totalPost = await Post.countDocuments()
        
        let totalPostPage = totalPost/itemPerPage


        let totalPage = parseInt(totalPostPage)
        
        let bookmarks = []

        if(req.user){
            let profile = await Profile.findOne({user:req.user._id})
            if(profile){
                bookmarks = profile.bookmarks
            }
        }

        res.render('pages/explorer/explorer.ejs',
        {
            title:'All Post',
            filter,
            flashMessage:Flash.getMessage(req),
            posts,
            correntPage,
            itemPerPage,
            totalPage,
            bookmarks
        })
    }catch(e){
        next(e)
    }
}
exports.singlePostGetController = async (req,res,next)=>{
 
    let { postId } = req.params
    try{    
        
        let post = await Post.findById(postId)
        .populate('author','username profilePics')
        .populate({
            path:'comments',
            populate:{
                path:'user',
                select:'username profilePics'
            }
        })
        .populate({
            path:'comments',
            populate:{
                path:'replies.user',
                select:'username profilePics'
            }
        })
        if(!post){
            let error = new Error('404 Page Not Found')
            error.status=404
            throw error
        }

        let bookmarks = []
        if(req.user){
            let profile = await Profile.findOne({user:req.user._id})
            if(profile){
                bookmarks = profile.bookmarks
            }
        }

        res.render('pages/explorer/singlePage.ejs',{
            title:post.title,
            flashMessage:Flash.getMessage(req),
            post,
            bookmarks
        })
        

    }catch(e){
        next(e)
    }
}