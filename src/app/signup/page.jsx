"use client"
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'

import Link from 'next/link'
import './signup.css'
const RegisterPage = () => {
    const router = useRouter()
    const [data, setData] = useState({ username: '', email: '', password: '',bio:'' })
    const [toastLoaded,setToastLoaded]= useState(false)
    const handleChange = (e) => {
        const { id, value } = e.target
        setData(() => {
            return { ...data, [id]: value }
        })
    }
 
    const handleSubmit = async (e) => {

        const axiosPromise = axios.post('/api/user/register', data, {
            headers: {
                "Content-Type": "application/json"
            }
        })
        e.preventDefault()
        toast.promise(
            axiosPromise,
            {
                loading: 'Wait a moment! Registering you..',
                success: (resp) => {
                    setData(() => ({ username: '', email: '', password: '' }))
                    setToastLoaded(true)
                    return resp.data.message
                },
                error: (err) =>{
                    setData(() => ({ username: '', email: '', password: '' }))
                    return err.response.data.message
                } 
            },
            {
                style: {
                    minWidth: '250px',
                },
                success: {
                    duration: 2000,
                    icon: '✔️',
                    style: {
                        backgroundColor:'lightgreen',
                        color:'black'
                    },

                },
                error: {
                    duration: 3000,
                    icon: '⚠️',
                    style: {
                        backgroundColor:'red',
                        color:'white'
                    },

                },
            }
        )
    }
    useEffect(()=>{
        if(toastLoaded){
            setTimeout(()=>{
                router.push('/login')
            },3000) 
        }
    },[toastLoaded])

    return (
        <>
            <div>
                <Toaster toastOptions={{
                    success: {
                        style: {
                            background: 'green',
                        },
                    },
                    error: {
                        style: {
                            background: 'red',
                        },
                    },
                }} />
            </div>

            <div className="container">
                <div className="card">
                    <div className="card_title">
                        <h1>Create Account</h1>
                        <span>Already have an account? <Link href="/login">Sign In</Link></span>
                    </div>
                    <div className="form">
                        <form method="post" onSubmit={handleSubmit}>
                            <input type="text" name="username" id="username" placeholder="UserName" value={data.username} onChange={handleChange} />
                            <input type="email" name="email" placeholder="Email" id="email" value={data.email} onChange={handleChange} />
                            <input type="password" name="password" placeholder="Password" id="password" value={data.password} onChange={handleChange} />
                            <input type="text" name="bio" placeholder="Enter bio" id="bio" value={data.bio} onChange={handleChange} />
                            <button>Sign Up</button>
                        </form>
                    </div>
                </div>
            </div>

        </>



    )
}

export default RegisterPage