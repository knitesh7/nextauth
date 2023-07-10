"use client"
import Link from 'next/link'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'
import { useUserInfo } from '../contexts/usercontext.js'

const Navbar = () => {
    const userInfo = useUserInfo()

    const router = useRouter();

    const handleLogout = (e) => {
        e.preventDefault()

        const axiosPromise = axios.post('/api/user/logout', {})

        toast.promise(
            axiosPromise,
            {
                loading: 'Wait!Signing you out!',
                success: (resp) => {
                    router.push('/login')
                    userInfo.dispatch({type:'out'})
                    return resp.data.message
                },
                error: (err) => {
                    return err.response?.data?.message
                }
            },
            {
                style: {
                    minWidth: '250px',
                },
                success: { style: { visibility: 'hidden' } },
                error: {
                    duration: 2000,
                    icon: '⚠️',
                    style: {
                        backgroundColor: 'red',
                        color: 'white'
                    },

                },
            }
        )
    }

    return (
        <>
            <div className='flex bg-black justify-evenly p-3'>
                <div><Link className="no-underline text-white" href='/'>Homepage</Link></div>
                <div className="no-underline text-white">About</div>
                {!userInfo?.user.loggedIn && 
                <>
                <div><Link className="no-underline text-white" href='/login'>Sign In</Link></div>
                <div><Link className="no-underline text-white" href='/signup'>Sign Up</Link></div>
                </>}
                
                {userInfo?.user.loggedIn && <div><Link className="no-underline text-white" href='/api/user/logout' onClick={handleLogout}>Logout</Link></div>}
                <div className="no-underline text-white">Contact</div>
            </div>
            <div>
                <Toaster toastOptions={{
                    error: {
                        style: {
                            background: 'red',
                        },
                    },
                }} />
            </div>

        </>

    )
}

export default Navbar