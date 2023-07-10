import idFetcher from "@/helpers/fetchIdFromToken";
import { NextRequest, NextResponse } from "next/server";
import UserModeler from "@/models/user";
import mongodbConnector from '@/dbConfig/mongoConn'

const GET = async(request: NextRequest)=>{
    await mongodbConnector()
    try {
        const userId = await idFetcher(request)
     
        const userProfile = await UserModeler.findById(userId).select('-password -__v -verifyToken -verifyTokenExpiry -forgotPasswordToken -forgotPasswordTokenExpiry')
   
        return NextResponse.json({ user: userProfile })
    } catch (error: any) {
        console.log('profile route error -->')
        console.log(error)
    }

}
export {GET}