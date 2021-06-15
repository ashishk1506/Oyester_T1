const express = require('express')
const router = express.Router()

const { validateToken} = require('../auth/jwt')

const authController = require('../controller/authController')

router.get('/',authController.home)
router.post('/registration',authController.registration)
router.get('/login',authController.login)
router.get('/posts',validateToken,authController.get_posts)
router.get('/posts/:id',validateToken,authController.get_post_byid)
router.post('/posts',validateToken,authController.create_post)
router.put('/posts/:id',validateToken,authController.update_post_byid)
router.delete('/posts/:id',validateToken,authController.delete_post_byid)
router.get('/logout',validateToken,authController.logout)

module.exports = router