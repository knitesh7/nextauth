import { Schema, model, models } from "mongoose";

const userSchema = Schema({
    username: {
        type: String,
        required: [true, 'Please provide an username'],
        unique: true
    },
    bio: {
        type: String,
        default:'Default bio📓'
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true
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