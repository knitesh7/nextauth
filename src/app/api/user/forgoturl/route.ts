import { NextRequest, NextResponse } from 'next/server'
import sendEmail from '@/helpers/emailsender.js'

const POST = async (request: NextRequest) => {
    try {
        const body = await request.json()
        try {
            if (!body || !body.email ) {
                return NextResponse.json({ message: 'Email not received', emailSent: false }, { status: 400 })
            } else {
                await sendEmail(body.email, 'ResetPass', body.email)
                return NextResponse.json({ emailSent: true}, { status: 200 })
            }

        } catch (error:any) {
            console.log('forgoturl reg2 : ', error.message)
            return NextResponse.json({ message: error.message, emailSent: false }, { status: 500 })
        }

    } catch (error:any) {

        console.log('forgoturl reg3 : ', error.message)
        return NextResponse.json({ message: error.message, emailSent: false }, { status: 500 })
    }

}


export { POST }