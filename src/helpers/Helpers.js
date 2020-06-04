import React from 'react'
import { Redirect } from 'react-router-dom';

export const HELPER_FUNCTIONS = {
    logout: () => {
        localStorage.setItem("userData", '')
        localStorage.setItem("token", '')
        localStorage.clear()
        return (<Redirect to='/' />)
    }
} 