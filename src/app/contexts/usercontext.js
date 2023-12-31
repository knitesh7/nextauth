"use client"
import { useContext, useReducer, createContext } from 'react';
const initialState = { loggedIn: false, token: null, info: null }
const userInfo = createContext(null)

const useUserInfo = () => {
    return useContext(userInfo)
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'in':
            return { ...state, loggedIn: true,token:action.payload }
        case 'out':
            return { ...state, loggedIn: false ,token:null}
        case 'setUser':
            return { ...state, info:action.payload}
        case 'delUser':
            return { ...state, ...initialState}
        case 'verified':
            return { ...state, info:{...state.info,isVerified:true}}
        default:
            break
    }
}

export default function UserInfoProvider(props){
    
    const [user, dispatch] = useReducer(reducer, initialState)
    return (
        <userInfo.Provider value={{ user, dispatch }}>
            {props.children}
        </userInfo.Provider>
    )

}

export { useUserInfo }