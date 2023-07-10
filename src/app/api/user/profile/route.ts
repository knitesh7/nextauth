import idFetcher from "@/helpers/fetchIdFromToken";
import { NextRequest, NextResponse } from "next/server";
import UserModeler from "@/models/user";
import mongodbConnector from '@/dbConfig/mongoConn'

const GET = async (request: NextRequest) => {
    await mongodbConnector()
    try {
        const userId = await idFetcher(request)
        if(!userId){
            return NextResponse.json({ message:'id not received'}, { status: 400 })
        }
        const userProfile = await UserModeler.findById(userId).select('-password -__v -verifyToken -verifyTokenExpiry -forgotPasswordToken -forgotPasswordTokenExpiry')

        return NextResponse.json({ user: userProfile }, { status: 200 })
    } catch (error: any) {
        console.log('profile route error -->')
        console.log(error)
        return NextResponse.json({ message: error.message }, { status: 500 })
    }

}
export { GET }