import mongodbConnector from '@/dbConfig/mongoConn'
import { NextRequest, NextResponse } from 'next/server'
import UserModeler from '@/models/user'
const POST = async (request: NextRequest) => {
    await mongodbConnector()
    try {
        const body = await request.json()
        try {
            if (!body || !body.id) {
                return NextResponse.json({ message: 'User Id not received', saved: false }, { status: 400 })
            } else {
                
                await UserModeler.findByIdAndDelete(body.id)
         
                return NextResponse.json({ message: 'Account deleted successfully!'}, { status: 200 })
            }

        } catch (error:any) {
            console.log('reg2 : ',error)
            return NextResponse.json({ message: error.message}, { status: 500 })
        }

    } catch (error:any) {
        
        console.log('reg3 : ',error)
        return NextResponse.json({ message: error.message}, { status: 500 })
    }


}
export {POST}