import { NextRequest, NextResponse } from 'next/server'

const POST = async (request: NextRequest) => {
    
    try {
     // Get a cookie
    const cookieVal = request.cookies.get('token')?.value
    return NextResponse.json({ token:cookieVal}, { status: 200 }, )

    } catch (error) {
        return NextResponse.json({ message: error, saved: false }, { status: 500 })
    }


}
export {POST}

