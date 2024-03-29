import React from 'react'
import { Navigate, Outlet } from 'react-router'
import { getItem, KEY_ACCESS_TOKEN } from '../utils/LocalStorageManager'

function RequireUser() {
    const user = getItem(KEY_ACCESS_TOKEN)
    return (
        user?<Outlet />:<Navigate to="/login"/>
    )
}  

export default RequireUser;