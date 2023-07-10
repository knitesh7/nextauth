import nodemailer from 'nodemailer'
import UserModeler from '@/models/user';
import bcryptjs from 'bcryptjs'
import mongodbConnector from '@/dbConfig/mongoConn.ts';
async function x(){
    await mongodbConnector()
}
x()

export default async function sendEmail(email, emailType, userKey) {
    try {
        const hashedToken = await bcryptjs.hash('dekh', 10)
        console.log('userKey : ',userKey)
        console.log('hashedToken : ',hashedToken)
        const options = { maxTimeMS: 60000 }
        switch (emailType) {
            case 'VerifyEmail':
        
                const expiryDuration = 60*60*1000 //milliseconds in 1hr
                await UserModeler.findOneAndUpdate({_id:userKey.toString()}, { verifyToken: hashedToken, verifyTokenExpiry: Date.now() + expiryDuration },options)
                break
            case 'ResetPass':
                await await UserModeler.findOneAndUpdate({email:userKey.toString()}, { forgotPasswordToken: hashedToken, forgotPasswordTokenExpiry: parseInt(Date.now()) + parseInt(36000) },options)
                break
            default:
                break
        }
        var transporter = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "492b10ca63ac33",
                pass: "8d0a21f34a021e"
            }
        });
        const mailOptions =  {
            from: 'projectsbyme1234@gmail.com', // sender address
            to: email, // list of receivers
            subject: emailType === 'VerifyEmail' ? 'Email Verification' : 'Reset Password', // Subject line
            text: "Either Copy below link and paste in the required place or click on the link", // plain text body
            html: `<a href='${process.env.DOMAIN}/${(emailType === 'VerifyEmail') ? 'verifyemail' : 'resetpassword'}?token=${hashedToken}>Click here or Copy this link</a> to  or ${(emailType === 'VerifyEmail') ? 'verify your email.' : 'reset the password.'}`, // html body
        }
        const mailResponse = await transporter.sendMail(mailOptions)
        return mailResponse

    } catch (error) {
        console.log('email sender error : ', error.message)
        throw new Error(error.message)
    }

}
