import type { NextRequest } from "next/server";
import jwt from 'jsonwebtoken'

export default async function idFetcher(request: NextRequest) {
    try {
        const token: any = request.cookies.get('token')!.value
    
        const payload: any = await jwt.verify(token, process.env.TOKEN_SEC_KEY!)
        return payload.userId
    } catch (error:any) {
        console.log('receivedError : ',error.message)
        throw new Error(error.message)
    }

}