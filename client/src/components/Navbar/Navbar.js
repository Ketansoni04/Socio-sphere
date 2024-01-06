import React, { useRef, useState } from 'react'
import { AiOutlineLogout } from "react-icons/ai";
import Avatar from '../Avatar/Avatar';
import './Navbar.scss'
import { useNavigate } from 'react-router-dom';
import {useDispatch, useSelector } from 'react-redux'


function Navbar() {
 
const dispatch = useDispatch()
const navigate = useNavigate()
const {loading,setLoading} =  useState(false);
const myProfile =  useSelector(state => state.appConfigReducer.myProfile )
 
function handleLogoutClick(){

}

  return (
    <div className='Navbar'> 
          
        <div className='container'>
            <h2 className='banner hover-link' onClick={() => navigate('/')}>Social Media</h2>
               <div className="right">
                    <div className='profile hover-link' onClick={() => navigate(`/profile/${myProfile?._id}`)}>
                        <Avatar src={myProfile?.avatar?.url} />
                    </div>
                    <div className='logout hover-link'>
                  <AiOutlineLogout />
                    </div>
               </div>
        </div>
    </div>
  )
}

export default Navbar
