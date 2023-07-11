"use client"
import { useState } from 'react'
import { useUserInfo } from '../../contexts/usercontext.js'
import moment from "moment/moment"
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'

const Profile = () => {

    const userInfo = useUserInfo()
    const [verifyUrl, setVerifyUrl] = useState('')
    const [err, setErr] = useState(null)
    const [tokenExpired, setTokenExpired] = useState(null)

    const handleChange = (e) => setVerifyUrl(() => e.target.value)
    
    const handleTokenSend = () => {
        setErr(()=>null)
        const tokenSendPromise = axios.post('/api/user/sendemailtoken', { id: userInfo.user.info._id, email: userInfo.user.info.email })
        toast.promise(
            tokenSendPromise,
            {
                loading: 'Wait! Sending token for Email Verification!',
                success: (resp) => {
                    setTokenExpired(() => null)
                    setVerifyUrl(() => '')
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
                success: {
                    duration: 2000,
                },
                error: {
                    duration: 2000,
                    icon: '⚠️',
                }
            }
        )
    }
    const handleVerify = () => {
        const token = verifyUrl.split('=')[1]
        const verifyEmailPromise = axios.post('/api/user/verifyemail', { token })
        toast.promise(
            verifyEmailPromise,
            {
                loading: 'Wait! Email Verification is going on!',
                success: (resp) => {
                    setVerifyUrl(() => '')
                    userInfo && userInfo.dispatch({ type: 'verified' })
                    setTokenExpired(() => null)
                    setErr(() => null)
                    return resp.data.message
                },
                error: (error) => {
                    if (error.response.data.currDate) {
                        const { currDate, verifyTokenExpiry, message } = error.response.data
                        setTokenExpired(() => true)
                        setVerifyUrl(() => '')
                        setErr(() => ({ currDate, verifyTokenExpiry, message }))
                        return message
                    } else {
                        setErr(() => null)
                        return error.response.data.message
                    }
                }
            },
            {
                style: {
                    minWidth: '250px',
                },
                success: {
                    duration: 2000,
                },
                error: {
                    duration: 2000,
                    icon: '⚠️',
                }
            }
        )

    }

    return (
        <>
            <div>
                <Toaster toastOptions={{
                    success: {
                        style: {
                            background: 'lightgreen',
                        },
                    },
                    error: {
                        style: {
                            background: 'red',
                        },
                    },
                }} />
            </div>
            <div className="w-fit bg-slate-600 m-auto">
                {userInfo.user.info && Object.entries(userInfo.user.info).map((x, i) => <p key={i} className="m-3 text-white text-center">{x[0]} 〰️ {String(x[1])}</p>)}
                {!userInfo.user.info.isVerified && (
                    <div>
                        <input type="text" placeholder='Paste received token-url here' value={verifyUrl} onChange={handleChange} /><br></br>
                        <button onClick={handleVerify}>Verifiy Email</button>
                        {tokenExpired && <button className='mx-3' onClick={handleTokenSend}>Repeat Email Verification</button>}
                    </div>
                )}

                <div className='bg-slate-200'>
                    {err && <div className='text-red-500'>{Object.entries(err).map((x, i) => <p key={i}>{(x[0] === 'currDate')? `Verification performed at --${moment(x[1]).format('DD-MM-YYYY h:mm:ss A')}` : (x[0] === 'verifyTokenExpiry') && `Token expiry time was--${moment(x[1]).format('DD-MM-YYYY h:mm:ss A')}`}</p>)}</div>}
                </div>
            </div>
        </>

    )
}
export default Profile