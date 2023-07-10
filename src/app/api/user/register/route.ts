import UserModeler from '@/models/user'
import mongodbConnector from '@/dbConfig/mongoConn'
import bcryptjs from 'bcryptjs'
import { NextRequest, NextResponse } from 'next/server'
import sendEmail from '@/helpers/emailsender'

const POST = async (request: NextRequest) => {
    await mongodbConnector()
    try {
        const body = await request.json()
        try {
            if (!body) {
                return NextResponse.json({ message: 'Body not received', saved: false }, { status: 400 })
            } else {
                const emptyFields = Object.entries(body).filter((x:any)=>x[1].length===0).map(x=>x[0])
                if (emptyFields.length>0) {
                    return NextResponse.json({ message: `Fill ${emptyFields}`, saved: false }, { status: 400 })
                }
                const salt = await bcryptjs.genSalt(10)
                const hashedPass = await bcryptjs.hash(body.password, salt)
                const savedUser = await UserModeler.create({ ...body, password: hashedPass })
                //sending email for email verification
                sendEmail(savedUser.email,'VerifyEmail',savedUser._id)
                
                return NextResponse.json({ message: 'Registered successfully!',saved: true ,savedUser}, { status: 200 }, )
            }

        } catch (error) {
            console.log('reg2 : ',error)
            return NextResponse.json({ message: error, saved: false }, { status: 500 })
        }

    } catch (error) {
        
        console.log('reg3 : ',error)
        return NextResponse.json({ message: error, saved: false }, { status: 500 })
    }


}
export {POST}
