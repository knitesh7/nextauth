import { NextRequest, NextResponse } from 'next/server'
import sendEmail from '@/helpers/emailsender.js'

const POST = async (request: NextRequest) => {
    try {
        const body = await request.json()
        try {
            if (!body) {
                return NextResponse.json({ message: 'User details not received', emailSent: false }, { status: 400 })
            } else {
                if(!body.email || !body.id){
                    return NextResponse.json({ message: 'Either userId or userEmail is missing', emailSent: false }, { status: 400 })
                }
                await sendEmail(body.email, 'VerifyEmail', body.id)
                return NextResponse.json({ emailSent: true,message:'Token has been sent✔️'}, { status: 200 })
            }

        } catch (error:any) {
            console.log('sendemailtoken reg2 : ', error.message)
            return NextResponse.json({ message: error.message, emailSent: false }, { status: 500 })
        }

    } catch (error:any) {

        console.log('sendemailtoken reg3 : ', error.message)
        return NextResponse.json({ message: error.message, emailSent: false }, { status: 500 })
    }

}


export { POST }