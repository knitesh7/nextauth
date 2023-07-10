import UserModeler from '@/models/user'
import mongodbConnector from '@/dbConfig/mongoConn'
import { NextRequest, NextResponse } from 'next/server'
import bcryptjs from 'bcryptjs'

const POST = async (request: NextRequest) => {
    await mongodbConnector()
    try {
        const body = await request.json()
        try {
            if (!body || !body.token || !body.email || !body.password) {
                return NextResponse.json({ message: 'Either email or password or token not received', emailSent: false }, { status: 400 })
            } else {

                const user = await UserModeler.findOne({ email: body.email })
                console.log('received token : ',user.forgotPasswordToken.toString())
                console.log('user token : ',body.token.toString())
                //token matching
                if(user.forgotPasswordToken.toString()===body.token.toString()){
                    const salt = await bcryptjs.genSalt(10)
                    const hashedPass = await bcryptjs.hash(body.password, salt)
                    await UserModeler.findOneAndUpdate({ email: body.email },{password:hashedPass})
                    return NextResponse.json({ passsetdone: true}, { status: 200 })
                }else{
                    return NextResponse.json({ passsetdone: false,message:'token is invalid'}, { status: 400 })
                }
            }

        } catch (error:any) {
            console.log('forgotpass reg2 : ', error.message)
            return NextResponse.json({ message: error.message, passsetdone: false }, { status: 500 })
        }

    } catch (error:any) {

        console.log('forgotpass reg3 : ', error.message)
        return NextResponse.json({ message: error.message, passsetdone: false }, { status: 500 })
    }

}


export { POST }