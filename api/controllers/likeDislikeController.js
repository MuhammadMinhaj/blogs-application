const Post = require('../../models/Post')

exports.likesGetController = async(req,res,next)=>{
    let { postId } = req.params
    let userId = req.user._id
    let liked = null;

    // Check user Authenticated or None-Authenticated
    if(!req.user){
        return res.status(403).json({
            error:'You\'re not an Authenticated User'
        })
    }

    try{
    
        let post = await Post.findById(postId)
    
    // Check user is Dislike and If dislike then removes to Dislike
    if(post.dislikes.includes(userId)){
        await Post.findOneAndUpdate(
            {_id:postId},
            {$pull:{'dislikes':userId}}
        )
    }

    // Check user is Likes and If likes then removes to Likes
    if(post.likes.includes(userId)){
        await Post.findOneAndUpdate(
            {_id:postId},
            {$pull:{'likes':userId}}
        )
        liked = false
    } 

    // Included Like to user
    else{
        await Post.findOneAndUpdate(
            {_id:postId},
            {$push:{'likes':userId}}
        )
        liked = true
    }

    // Find Updated Post for return Font-End
    let updatedPost = await Post.findById(postId)

    return res.status(200).json({
        liked,
        totalLikes:updatedPost.likes.length,
        totalDislikes:updatedPost.dislikes.length
    })

    }catch(e){
        console.log(e)
        res.status(500).json({
            error:'Server Error Occurred'
        })
    }

}
exports.dislikesGetController = async (req,res,next)=>{
    let { postId } = req.params
    let userId = req.user._id
    let disliked = null

    // Check User is Authenticated or None-Authenticated
    if(!req.user){
        return res.json(403).json({
            error:'You\'re not an Authenticated User'
        })
    }

   try{ 
       let post  = await Post.findById(postId)
       
    // Check likes and If likes then remove to likes
    if(post.likes.includes(userId)){
        await Post.findOneAndUpdate(
            {_id:postId},
            {$pull:{'likes':userId}}
        )
    }

    // Check dislikes and If dislikes then remove to Dislikes
    if(post.dislikes.includes(userId)){
        await Post.findOneAndUpdate(

            // {_id:userId},
            {_id:postId},
            {$pull:{'dislikes':userId}}
        )
        disliked = false
    }

    // included Dislikes
    else{
        await Post.findOneAndUpdate(
            {_id:postId},
            {$push:{'dislikes':userId}}
        )
        disliked = true
    }

    // Updated Post return for Font-End
    let updatedPost = await Post.findById(postId)

    return res.status(200).json({
        disliked,
        totalLikes: updatedPost.likes.length,
        totalDislikes:updatedPost.dislikes.length
        
    })


   }catch(e){
       console.log(e)
       res.status(500).json({
           error:'Server Error Occurred'
       })
   }
    
}