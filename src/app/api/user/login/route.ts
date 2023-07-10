import UserModeler from '@/models/user'
import mongodbConnector from '@/dbConfig/mongoConn'
import bcryptjs from 'bcryptjs'
import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
const secretKey = process.env.TOKEN_SEC_KEY!

const POST = async (request: NextRequest) => {
    await mongodbConnector()
    try {
        const body = await request.json()
        try {
            if (!body) {
                return NextResponse.json({ message: 'Body not received', saved: false }, { status: 400 })
            } else {
                const emptyFields = Object.entries(body).filter((x: any) => x[1].length === 0).map(x => x[0])
                if (emptyFields.length > 0) {
                    return NextResponse.json({ message: `Fill ${emptyFields}`, saved: false }, { status: 400 })
                }
                const { email, password } = body
                const user = await UserModeler.findOne({ email })

                if (!user) {
                    return NextResponse.json({ message: `Invalid User`, saved: false }, { status: 400 })
                }
                const didPassMatched = await bcryptjs.compare(password, user.password)
                if (!didPassMatched) {
                    return NextResponse.json({ message: `Wrong Password`, saved: false }, { status: 400 })
                }

                //generating token
                const payload = {
                    userId: user._id,
                    email,
                    isAdmin: user.isAdmin
                }
                const token = jwt.sign(payload, secretKey, { expiresIn: '1d' })
                const response = NextResponse.json({ validUser: true, token }, { status: 200 })
                response.cookies.set('token', token, { httpOnly: true })
                return response
            }

        } catch (error) {
            console.log('reg2 : ', error)
            return NextResponse.json({ message: error, saved: false }, { status: 500 })
        }

    } catch (error) {

        console.log('reg3 : ', error)
        return NextResponse.json({ message: error, saved: false }, { status: 500 })
    }


}

export {POST}