import { NextRequest, NextResponse } from "next/server";
import UserModeler from '@/models/user';
import mongodbConnector from "@/dbConfig/mongoConn";
const POST = async (request:NextRequest) => {
    await mongodbConnector()
    try {
        const body = await request.json()
        console.log('body token : ', body.token)
        const user1 = await UserModeler.findOne({ verifyToken: body.token.toString() })
        user1?console.log('user1 exists'):console.log('user1 doesnt exists')
        const dateObj = {verifyTokenExpiry:user1.verifyTokenExpiry,currDate:new Date()}
        console.log('dateobj : ',dateObj)
        const user2 = await UserModeler.findOne({ verifyToken: body.token.toString(), verifyTokenExpiry: { $gte: new Date() } })
        user2?console.log('user2 exists'):console.log('user2 doesnt exists')
        if (!user1) {
            return NextResponse.json({ message: 'Invalid Token' }, { status: 400 })
        } else if (!user2) {
            
            return NextResponse.json({ message: 'Token Expired,Try verifying again..',...dateObj}, { status: 400 })
        }
        await UserModeler.findByIdAndUpdate(user2._id, { isVerified: true })
        return NextResponse.json({ message: 'Email Verified Succesfully' }, { status: 200 })

    } catch (error:any) {
        console.log('err mesg --',error.message)
        return NextResponse.json({ message: error.message }, { status: 500 })
    }
}
export { POST }