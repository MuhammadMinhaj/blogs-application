const Profile = require('../../models/Profile')

exports.bookmarksGetController = async (req,res,next)=>{
    let { postId } = req.params
    let bookmarks = null

    // Check user is Authemticated or None-Authenticated
    if(!req.user){
        return res.status(403).json({
            error:'You\'re not an Authenticated User'
        })
    }
    let userId = req.user._id

    try{
        let profile = await Profile.findOne({user:userId})
        // Check user already bookmarks and If Bookmarks then remove to Bookmarks
        if(profile.bookmarks.includes(postId)){
            await Profile.findOneAndUpdate(
                {user:userId},
                {$pull:{'bookmarks':postId}}
            )
            bookmarks = false
        }

        // Included Bookmarks   
        else{
            await Profile.findOneAndUpdate(
                {user:userId},
                {$push:{'bookmarks':postId}}
            )
            bookmarks = true
        }

    
        // Retrun for Font-End
        res.status(200).json({
            bookmarks
        })

    }catch(e){
        console.log(e)
        res.status(500).json({
            error:'Server Error Occurred'
        })
    }

}