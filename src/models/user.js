import mongoose, { Schema, model, models } from "mongoose";

const userSchema = Schema({
    username: {
        type: String,
        required: [true, 'Please provide an username'],
    },
    bio: {
        type: String,
        default: 'Default bio📓'
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        validate: {
            validator: function (value) {
                return mongoose
                    .model('users')
                    .countDocuments({ email: value })
                    .then((count) => count === 0);
            },
            message: 'User with provided email address already exists.Try with different email address or reset the password'
        }
    },
    password: {
        type: String,
        required: [true, 'Please provide an password']
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
    verifyToken: String,
    verifyTokenExpiry: Date
})

const userModeler = models.users || model('users', userSchema)

export default userModeler