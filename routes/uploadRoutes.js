const router = require('express').Router();
const { isAuthenticated } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware')
// const {uploadProfilePics }= require('../controllers/uploadController')

const { 
    uploadProfilePics,
    deleteProfilePics,
    postImageUploadController
}  = require('../controllers/uploadController')

router.post('/profile-pics',
    isAuthenticated,
    upload.single('profilePics'),
    uploadProfilePics
   
)
router.delete('/profile-pics',isAuthenticated,deleteProfilePics)

router.post('/postimage',isAuthenticated,upload.single('post-image'),postImageUploadController)

module.exports = router;