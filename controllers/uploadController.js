const fs = require('fs')
const User = require('../models/User');
const Profile = require('../models/Profile');
const Flash = require('../utils/Flash')


module.exports.uploadProfilePics = async (req, res, next) => {
  let oldProfilePics = req.user.profilePics
  if (req.file) {
    try {
      let profile = await Profile.findOne({ user: req.user._id });
      let profilePics = `/uploads/${req.file.filename}`;
      if (profile) {
        await Profile.findOneAndUpdate(
          { _id: req.user._id },
          { $set: { profilePics } }
        );
      }
      await User.findOneAndUpdate(
        { _id: req.user._id },
        { $set: { profilePics: profilePics } }
      );
      res.redirect('/dashboard/create-profile');
      if(oldProfilePics!=='/uploads/default.png'){
        fs.unlink(`public${oldProfilePics}`,error=>{
          if(error){
            console.log(`The Error Founded on : ${error}`)
          }
        })
      }
    } catch (e) {
      res.status(500).json({
        profilePics: req.user.profilePics
      });
    }
  } else {
    // res.status(500).json({
    //   profilePics: req.user.profilePics
    // });
    res.render('pages/error/alert',{flashMessage:Flash.getMessage(req)})
  }
};
module.exports.deleteProfilePics =  (req, res, next) => {
    let correntProfilePicsPath = req.user.profilePics;
    let defaultProfilePics = '/uploads/default.png'
    fs.unlink(`public${correntProfilePicsPath}`,async (err)=>{
        try{
            if(err){
                throw new Error(err)
            }
            let profile =await Profile.findOne({id:req.user._id})
            if(profile){
               await profile.findOneAndUpdate(
                   {user:req.user._id},
                   {$set:{
                       profilePics:defaultProfilePics
                   }}
                   
                   )
            }
             await User.findOneAndUpdate(
                {_id:req.user._id},
                {$set:{
                    profilePics:defaultProfilePics
                }}
                )
            res.status(200).json({
                profilePics:defaultProfilePics
            })
        }
        catch(e){
          console.log(e)
            res.status(500).json({
              err:e
            })
        
        }
    })
};
module.exports.postImageUploadController = (req,res,next)=>{
  if(req.file){
    return res.status(200).json({
      imgUrl:`/uploads/${req.file.filename}`
    })
  }
  return res.status(500).json({
    message:'Server Error Occurred'
  })
}