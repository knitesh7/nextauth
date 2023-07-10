"use client"
import Link from 'next/link'
import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'
import { useUserInfo } from '../contexts/usercontext.js'

const LoginPage = () => {
    const userInfo = useUserInfo()
    const router = useRouter()
    const [visibleUpdate, setvisibleUpdate] = useState(false)
    const [email, setemail] = useState('')
    const [fp, setFp] = useState(false)
    const [password, setpassword] = useState('')
    const [urltoken, seturltoken] = useState('')
    const [data, setData] = useState({ email: '', password: '' })

    const handleChange = (e) => {
        const { id, value } = e.target
        setData(() => {
            return { ...data, [id]: value }
        })
    }

    const handleSubmit = async (e) => {
        const axiosPromise = axios.post('/api/user/login', data, {
            headers: {
                "Content-Type": "application/json"
            }
        })
        e.preventDefault()
        toast.promise(
            axiosPromise,
            {
                loading: 'Wait a moment!',
                success: (resp) => {
                    setData(() => ({ email: '', password: '' }))
                    router.push('/profile')
                    //getting token
                    axios.post('/api/user/token', {}).then(resp => {
                        if (resp.data.token && resp.data.token !== "") {
                            userInfo && userInfo.dispatch({ type: 'in', payload: resp.data.token })
                        }
                    }).catch(err => console.log(err))

                    return resp.data.message
                },
                error: (err) => {
                    setData(() => ({ email: '', password: '' }))
                    return err.response.data.message
                }
            },
            {
                style: {
                    minWidth: '250px',
                },
                success: {
                    duration: 1000,
                    style: {
                        visibility: 'hidden'
                    },
                },
                error: {
                    duration: 3000,
                    icon: '⚠️',
                    style: {
                        backgroundColor: 'red',
                        color: 'white'
                    },

                },
            }
        )
    }



    const handleMailSend = async () => {
        try {
            const resp = await axios.post('/api/user/forgoturl', { email })
            setvisibleUpdate(true)
        } catch (error) {
            console.log(error.response.data)
            alert(error.response.data.message)
        }
    }
    const handleFPChange = (e) => {
        switch (e.target.id) {
            case 'email':
                setemail(() => e.target.value)
                break;
            case 'urltoken':
                seturltoken(() => e.target.value)
                break;
            case 'password':
                setpassword(() => e.target.value)
                break;
            default:
                break
        }
    }
    const handleForgotPass = async () => {
        try {
            const token = urltoken.split('=')[1]

            const resp = await axios.post('/api/user/forgotpass', { token: token, email, password })
            if(resp.data){
                alert('Password Updated')
                setFp(()=>false)
            }
        } catch (error) {
            alert(error.response.data.message)
        }

    }

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
                        <h1>Get Logged In</h1>
                        <span>New User? <Link href="/signup">Register here..</Link></span>
                    </div>
                    <div className="form">
                        <form method="post" onSubmit={handleSubmit}>
                            <input type="email" name="email" placeholder="Email" id="email" value={data.email} onChange={handleChange} />
                            <input type="password" name="password" placeholder="Password" id="password" value={data.password} onChange={handleChange} />
                            <button>Sign In</button>

                        </form>
                    </div>
                    {!fp ? (<div><button onClick={() => setFp(true)}>Forgot Password?</button></div>) : (
                        <div >
                            {!visibleUpdate && (
                                <><input className='p-1 m-1' type='text' placeholder='Enter your email' value={email} id='email' onChange={handleFPChange}></input>
                                    <button className='bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold p-1 m-1 rounded-l' onClick={handleMailSend}>Send Url-Token</button>
                                    <div className='flex justify-center'><button className='bg-white hover:bg-gray-100 text-gray-800 font-semibold p-0 border border-gray-400 m-1 rounded shadow' onClick={() => setFp(false)}>Cancel Password Update</button></div>
                                    
                                    </>
                                    )
                                    
                            }

                            <div>
                                {visibleUpdate && (<>
                                    <input className='m-1 w-full' type='text' placeholder='Enter token url' value={urltoken} id='urltoken' onChange={handleFPChange}></input>
                                    <input  type='text' placeholder='Enter new password' value={password} id='password' onChange={handleFPChange}></input>
                                    <button className='bg-white hover:bg-gray-100 text-gray-800 font-semibold border bg-green-200 border-gray-400  m-1 rounded shadow' onClick={handleForgotPass}>Update Password</button>
                                </>)}

                                <div className='flex justify-center'>{visibleUpdate && <button className='bg-white hover:bg-gray-100 text-gray-800 font-semibold border border-gray-400 p-0 m-2 rounded shadow' onClick={() => setFp(false)}>Cancel Password Update</button>}</div>
                            </div>

                        </div>)}

                </div>
            </div>

        </>

    )
}

export default LoginPage