import UserModeler from '@/models/user'
import mongodbConnector from '@/dbConfig/mongoConn'
import { NextRequest, NextResponse } from 'next/server'

const POST = async (request: NextRequest) => {
    await mongodbConnector()
    try {
        const body = await request.json()
        try {
            if (!body || !body.id) {
                if (!body && !body.id && !body.updatedData) {
                    return NextResponse.json({ message: 'Data to update was not received', saved: false }, { status: 400 })
                }
                return NextResponse.json({ message: 'User Id not received', saved: false }, { status: 400 })
            } else {

                const updatedUser = await UserModeler.findByIdAndUpdate(body.id, body.updatedData, { new: true })

                return NextResponse.json({ message: 'Updated Profile successfully!', saved: true, user: updatedUser }, { status: 200 },)
            }

        } catch (error: any) {
            console.log('reg2 : ', error)
            return NextResponse.json({ message: error.message }, { status: 500 })
        }

    } catch (error: any) {

        console.log('reg3 : ', error)
        return NextResponse.json({ message: error.message }, { status: 500 })
    }
}
export { POST }
