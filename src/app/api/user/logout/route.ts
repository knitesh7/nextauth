
import mongodbConnector from '@/dbConfig/mongoConn'
import {  NextResponse } from 'next/server'

const POST = async () => {
    await mongodbConnector()
    try {
        const response = NextResponse.json({message:'Logout Successfull',success:true})
        response.cookies.set('token',"",{httpOnly:true,expires:new Date(0)})
        return response
    } catch (error) {
        return NextResponse.json({ message: error, saved: false }, { status: 500 })
    }
}
export {POST}
