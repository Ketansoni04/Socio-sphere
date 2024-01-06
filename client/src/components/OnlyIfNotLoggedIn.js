import React from 'react'
import { KEY_ACCESS_TOKEN, getItem } from '../utils/LocalStorageManager'
import { Navigate, Outlet } from 'react-router-dom'

function OnlyIfNotLoggedIn() {
 
    const user = getItem(KEY_ACCESS_TOKEN)
    return user?<Navigate to="/home"/> :<Outlet />

}

export default OnlyIfNotLoggedIn
