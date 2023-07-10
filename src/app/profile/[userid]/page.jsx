"use client"
import { useState } from 'react'
import { useUserInfo } from '../../contexts/usercontext.js'
import moment from "moment/moment"
import axios from 'axios'

const Profile = ({ params }) => {

    const userInfo = useUserInfo()
    const [verifyUrl, setVerifyUrl] = useState('')
    const [err1, setErr1] = useState(null)
    const [err2, setErr2] = useState(null)
    const [msg, setMsg] = useState(null)
 
    const handleChange = (e) => {
        setVerifyUrl(() => e.target.value)
    }
    const handleVerify = () => {
        const token = verifyUrl.split('=')[1]
        async function temp() {
            if (token) {
                try {
                    const resp = await axios.post('/api/user/verifyemail', { token })
                    setMsg(() => resp.data.message)
                    userInfo && userInfo.dispatch({type:'verified'})
                } catch (error) {
                    console.log(error.response.data.message)
                    if (error.response.data.currDate) {
                        const { currDate, verifyTokenExpiry, message } = error.response.data
                        setErr2(() => ({ currDate, verifyTokenExpiry, message }))
                    } else {
                        setErr1(() => error.response.data.message)
                    }

                }

            }
        }
        temp()
    }
    return (
        <div className="w-fit bg-slate-600 m-auto">
            {userInfo.user.info && Object.entries(userInfo.user.info).map((x,i) => <p key={i} className="m-3 text-white text-center">{x[0]} 〰️ {String(x[1])}</p>)}
            {!userInfo.user.info.isVerified && (
                <div>
                    <input type="text" placeholder='enter token url here' value={verifyUrl} onChange={handleChange} /><br></br>
                    <button onClick={handleVerify}>Verifiy Email</button>
                </div>
            )}
            
            <div className='bg-slate-200'>
           
                <h2>{msg && <><span>Email Verification Status -- </span><div className='text-teal-500'> {msg}</div></>}</h2>
                {err1 && <p className='text-red-500'>{err1}</p>}
                {err2 && <div className='text-red-500'>{Object.entries(err2).map((x,i) => <p key={i}>{x[0] === 'currDate' ? `Verification performed at --${moment(x[1]).format('DD-MM-YYYY h:mm:ss A')}` : (x[0] === 'verifyTokenExpiry') ? `Token expiry time was--${moment(x[1]).format('DD-MM-YYYY h:mm:ss A')}` : `${x[0]}--${x[1]}`}</p>)}</div>}
            </div>
        </div>
    )
}
export default Profile