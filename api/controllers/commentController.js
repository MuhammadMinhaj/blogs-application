const Post = require('../../models/Post')
const Comments = require('../../models/Comment')

exports.commentPostController = async (req,res,next)=>{
    let { postId } = req.params
    let user = req.user
    let { body } = req.body
    if(!user){
        return res.status(403).json({
            error:'You\'re not authenticated user'
        })
    }
    let comments = new Comments({
        post:postId,
        user:user._id,
        body:body,
        replies:[]
    })
    try{ 
        let createdComment = await comments.save()
        await Post.findOneAndUpdate(
            {_id:postId},
            {$push:{'comments':createdComment._id}}
        )
            let commentJSON = await Comments.findById(createdComment._id).populate({
                path:'user',
                select:'profilePics username'
            })
            return res.status(201).json(commentJSON)

    }catch(e){
        console.log(e)
        return res.status(500).json({
            error:'Server Error Occurred'
        })
    }


}
exports.replyCommentPostController =async (req,res,next)=>{

    let { commentsId } = req.params
    let  {body}  = req.body
    let userId = req.user._id
    if(!req.user){
        return res.status(403).json({
            error:'You\'re not authenticated user'
        })
    }
    let reply = {
        body,
        user:userId
    }
    try{
        await Comments.findOneAndUpdate(
        {_id:commentsId},
        {$push:{'replies':reply}}
        )
        return res.status(200).json({
            ...reply,
            profilePics:req.user.profilePics
        })

    }catch(e){
        console.log(e)
        return res.status(500).json({
            error:'Server Error Occurred'
        })
    }
}