
//Get user Info

const userModel = require("../models/userModel");
const bcrypt = require('bcryptjs');

// const getUserController = async (req, res) =>{
//     try {
//         const userId = req.user.id;
//          const user = await userModel.findById(userId);
//          if(!user){
//             return res.status(404).send({
//                 success: false,
//                 message: 'User not found',
//             });
//             }
//             //hide password
//         user.password = undefined;
//          res.status(200).send({
//             success: true,
//             message: 'User fetched successfully',
//             user,
//             });
//     } catch (error) {
//         console.log(error);
//         res.status(500).send({
//             success: false,
//             message: 'Error in user controller',
//         });
//     }
// }

//Update user info
const updateUserController = async (req, res) => {
    try {
        const userId = req.user.id;
        const { userName, email, } = req.body
        const user = await userModel.findByIdAndUpdate(userId, { userName, email, }, { new: true, runValidators: true });
        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'User not found',
            });
        }   
        //hide password
        user.password = undefined;
        res.status(200).send({
            success: true,
            message: 'User updated successfully',
            user,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in updating user info',
        });
        
    }
}

//Update password
const updatePasswordController = async (req, res) => {
    try {
        const userId = req.user.id;
        const { oldPassword, newPassword } = req.body;
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'User not found',
            });
        }
        if (!oldPassword || !newPassword ) {
            return res.status(400).send({
                success: false,
                message: 'Old password and new password are required',
            });
        }
        // Check if old password matches
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).send({
                success: false,
                message: 'Old password is incorrect',
            });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password
        if (hashedPassword === user.password) {
            return res.status(400).send({
                success: false,
                message: 'New password cannot be the same as the old password',
            });
        }
        // Save the new password
        user.password = hashedPassword;
        await user.save();
        res.status(200).send({
            success: true,
            message: 'Password updated successfully',
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in updating password',
            error
        });
    }
}

//Delete user
 const deleteUserController = async (req, res) => {
    try {
        const userId = req.user.id;
        if (!userId) {
            return res.status(400).send({
                success: false,
                message: 'User ID is required',
            });
        }
        const user = await userModel.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'User not found',
            });
        }
        return res.status(200).send({
            success: true,
            message: 'User deleted successfully',
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in deleting user',
            error
        });
    }
 }
module.exports = {updateUserController, updatePasswordController,deleteUserController }