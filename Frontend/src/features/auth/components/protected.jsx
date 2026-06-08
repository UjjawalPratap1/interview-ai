import React from 'react'
import { useAuth } from '../hooks/useAuth.js'
import { Navigate } from 'react-router'

const Protected = ({children}) => {
    const {loading, user} = useAuth();

    if(loading){
        return <div>Loading...</div>
    }

    if(!user){
        return <Navigate to="/login" />
    }

    return children;
}

export default Protected