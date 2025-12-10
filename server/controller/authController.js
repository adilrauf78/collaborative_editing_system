const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();


//Register
const registerController = async(req, res) =>{
    try {
        const { userName, email, password, } = req.body;
        //validation

        if(!userName || !email || !password){
           return  res.status(404).send({
                success: false,
                message: 'Please provide all fields',
            })
        }
        
        //check user
        const existing = await userModel.findOne({ email });
        if(existing){
            res.status(404).send({
                success: false,
                message: 'Email is already Registerd. Please login',
            })
        }
        //hashing
        var salt = bcrypt.genSaltSync(10);
        const hashedPassword = await bcrypt.hash(password, salt, );
        //create new user
        //const user = await userModel.create({userName, email, phone, password: hashedPassword,})
        const user = new userModel({userName, email, password: hashedPassword,});
        await user.save();
        res.status(201).send({
            success: true,
            message: 'User Registerd Successfully',
            user,
        })

    } catch (error) {
        console.log(error); 
        res.status(500).send({
            success: false,
            message: 'Error in Register Api',
            error,
        })
    }    
}


//Login

const loginController = async (req, res) => {
    try {
        const {email , password} = req.body;
        //validation
        if(!email || !password){
            return res.status(400).send({
                success: false,
                message: 'Please provide Email or Password',
            })
        }
        //check user
        const user = await userModel.findOne({ email });
        if(!user){
             return res.status(404).send({
                success: false,
                message: 'User not found',
            })
        }
        //check user password || compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(404).send({
                success: false,
                message: "Invalid Creditionals"
            })
        }
        user.password = undefined;
        const accessToken = jwt.sign({id: user._id}, process.env.JWT_SECRET, { expiresIn: '7d' });
        const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });
        res.status(200).send({
            success: true,
            message: "Successfully Login",
            accessToken,
            refreshToken,
            user,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in Login Api",
            error
        })
    }
}

const refreshTokenController = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).send({ success: false, message: "Refresh token is required" });
        }

        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
            if (err) return res.status(401).send({ success: false, message: "Invalid refresh token" });

            const newAccessToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
            res.status(200).send({ success: true, accessToken: newAccessToken });
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: "Error in refresh token", error });
    }
};

module.exports = {registerController, loginController,refreshTokenController};