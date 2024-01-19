import React, { useRef, useState } from 'react'
import { AiOutlineLogout } from "react-icons/ai";
import Avatar from '../Avatar/Avatar';
import './Navbar.scss'
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux'
import {removeItem,KEY_ACCESS_TOKEN} from '../../utils/LocalStorageManager'
import { axiosClient } from '../../utils/axiosClient';


function Navbar() {
 
const navigate = useNavigate()
const myProfile =  useSelector((state) => state.appConfigReducer.myProfile )
 
async function handleLogoutClick(){
        await axiosClient.post('auth/logout')
        removeItem(KEY_ACCESS_TOKEN)
        navigate('/login')

}

  return (
    <div className='Navbar'> 
          
        <div className='container'>
            <h2 className='banner hover-link' onClick={() => navigate('/')}>Social Media</h2>
               <div className="right">
                    <div className='profile hover-link' onClick={() => navigate(`/profile/${myProfile?._id}`)}>
                        <Avatar src={myProfile?.avatar?.url} />
                    </div>
                    <div className='logout hover-link' onClick={handleLogoutClick}>
                  <AiOutlineLogout />
                    </div>
               </div>
        </div>
    </div>
  )
}

export default Navbar
