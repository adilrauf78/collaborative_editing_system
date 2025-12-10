const express = require('express');
const { registerController, loginController, refreshTokenController} = require('../controller/authController');

const router = express.Router(); 

//routes

// Register user (signup) || POST
router.post('/signup', registerController)


//Login || POST
router.post('/login', loginController);
// Refresh Token

router.post('/refresh-token', refreshTokenController);


module.exports = router;