const router = require('express').Router();
const {
    singupGetController,
    singupPostController,
    loginGetController,
    loginPostController,
    logoutController,
    changePasswordGetController,
    changePasswordPostController
} = require('../controllers/authController');
const singupValidator = require('../validator/auth/singupValidator')
const loginValidator = require('../validator/auth/loginValidator');

const { 
    isUnAthenticated,
    isAuthenticated
} = require('../middleware/authMiddleware')


// Singup Router
router.get('/singup',isUnAthenticated,singupGetController)
router.post('/singup',isUnAthenticated,singupValidator,singupPostController)
// Login Router
router.get('/login',isUnAthenticated,loginGetController)
router.post('/login',isUnAthenticated,loginValidator,loginPostController)
// Logout Router
router.get('/logout',logoutController)

// Password Updated
router.get('/change-password',isAuthenticated,changePasswordGetController)
router.post('/change-password',isAuthenticated,changePasswordPostController)

module.exports = router