"use client"
import { useEffect } from 'react';
import axios from 'axios'
import { useUserInfo } from '../contexts/usercontext.js'
import { useRouter } from 'next/navigation'
const Profile1 = () => {
    const router = useRouter()
    const userInfo = useUserInfo()
    useEffect(() => {
        const fn = async () => {
            try {
                const resp = await axios.get('/api/user/profile')
                console.log('user details ', resp.data)
                userInfo.dispatch({ type: 'setUser', payload: resp.data.user })
                router.push(`/profile/${resp.data.user._id}`)
            } catch (error) {
                alert(error.response.data.message)
            }
        }
        fn()

    }, [])

    return (
        <div>
            Welcome to profile!
        </div>
    )
}

export default Profile1