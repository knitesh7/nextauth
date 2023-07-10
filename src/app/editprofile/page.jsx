"use client"
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'

import Link from 'next/link'

const EditPage = () => {
    const router = useRouter()
    const [updatedData, setupdatedData] = useState({ username: '', bio: ''})
    const [doneUpdate,setdoneUpdate]= useState(false)
    const handleChange = (e) => {
        const { id, value } = e.target
        setupdatedData(() => {
            return { ...updatedData, [id]: value }
        })
    }
 
    const handleSubmit = async (e) => {
        e.preventDefault()
        const editProfilePromise = axios.post('/api/user/edit', {id:userInfo.user.info._id,updatedData}, {
            headers: {
                "Content-Type": "application/json"
            }
        })
        
        toast.promise(
            editProfilePromise,
            {
                loading: 'Wait! Updating your profile!',
                success: (resp) => {
                    userInfo.dispatch({type:'setUser',payload: resp.data.user})
                    setdoneUpdate(()=>true)
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
                    style: {
                        backgroundColor: 'red',
                        color: 'white'
                    },

                },
            }
        )
    }
    useEffect(()=>{
        if(doneUpdate){
            setTimeout(()=>{
                router.push('/profile')
            },2000) 
        }
    },[doneUpdate])

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
                        <h1>Update Profile</h1>
                        <div><Link href="/profile">Cancel Updating</Link></div>
                    </div>
                    <div className="form">
                        <form method="post" onSubmit={handleSubmit}>
                            <input type="text" name="username" id="username" placeholder="UserName" value={updatedData.username} onChange={handleChange} />
                            <input type="text" name="bio" placeholder="Enter bio" id="bio" value={updatedData.bio} onChange={handleChange} />
                            <button type='submit'>Update Profile</button>
                        </form>
                    </div>
                </div>
            </div>

        </>
    )
}

export default EditPage