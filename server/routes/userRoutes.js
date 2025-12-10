const express = require('express');
const router = require('./authRoutes');
const { updateUserController, updatePasswordController, deleteUserController } = require('../controller/userController');
const authMiddlewares = require('../middlewares/authMiddlewares');


//routes
//Get user info || GET
// router.post('/getUser', authMiddlewares, getUserController),

//Update user info || PUT
router.post('/editProfile', authMiddlewares, updateUserController),

//update password || Post
router.post('/updatePassword', authMiddlewares, updatePasswordController),

//delete user || DELETE
router.post('/deleteAccount', authMiddlewares, deleteUserController),
module.exports = router;