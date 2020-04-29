const router = require('express').Router();
const postValidator = require('../validator/dashboard/post/postValidator')
const { isAuthenticated } = require('../middleware/authMiddleware')
const {
    createPostGetController,
    createPostPostController,
    editPostGetController,
    editPostPostController,
    deletePostGetController,
    getAllPostController
} = require('../controllers/postController')
const upload = require('../middleware/uploadMiddleware')

router.get('/create',isAuthenticated,createPostGetController)
router.post('/create', isAuthenticated,upload.single('post-thumbnail'),postValidator,createPostPostController)

router.get('/edit/:postId',isAuthenticated,editPostGetController)
router.post('/edit/:postId',isAuthenticated,upload.single('post-thumbnail'),postValidator,editPostPostController)

router.get('/delete/:postId',isAuthenticated,deletePostGetController)


router.get('/',isAuthenticated,getAllPostController)

module.exports = router;
