"use client"
import { useEffect, useState } from "react"
import axios from 'axios'
import moment from "moment/moment"

const EmailVerifySection = () => {
    const [token, setToken] = useState(null)
    const [err1, setErr1] = useState(null)
    const [err2, setErr2] = useState(null)
    const [msg, setMsg] = useState(null)
    useEffect(() => {
        const tokenFetched = window.location.search.split('=')[1]
        setToken(() => tokenFetched)
    }, [])
    useEffect(() => {
        async function temp(){
            if (token) {
                try {
                    const resp = await axios.post('/api/user/verifyemail', { token })
                    setMsg(() => resp.data.message)
                } catch (error) {
                    console.log(error.response.data.message)
                    if(error.response.data.currDate){
                        const {currDate,verifyTokenExpiry,message} = error.response.data
                        setErr2(() => ({currDate,verifyTokenExpiry,message}))
                    }else{
                        setErr1(() => error.response.data.message)
                    }
                    
                }
    
            }
        }
        temp()
    }, [token])
    return (
        <div>
            <h1>Email Verification Status</h1>
            {msg && <div>{msg}</div>}
            {err1 && <p>{err1}</p>}
            {err2 && <div>{Object.entries(err2).map((x,i)=><p key={i}>{x[0]==='currDate'?`Verification performed at --${moment(x[1]).format('DD-MM-YYYY h:mm:ss A')}`:(x[0]==='verifyTokenExpiry')?`Token expiry time was--${moment(x[1]).format('DD-MM-YYYY h:mm:ss A')}`:`${x[0]}--${x[1]}`}</p>)}</div>}
        </div>
    )
}

export default EmailVerifySection