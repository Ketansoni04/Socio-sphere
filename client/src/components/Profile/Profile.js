import React, { useEffect, useState } from 'react'
import Post from '../Posts/Post'
import CreatePost from '../CreatePost/CreatePost'
import './Profile.scss'
import profileImg from '../../assests/meerkat.png'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getUserProfile } from '../../redux/slices/postSlice'

function Profile() {
  
    const [isMyProfile,setIsMyProfile] = useState(false);
    
    const navigate = useNavigate()
    const params = useParams()
    const dispatch = useDispatch();

    
    const myProfile = useSelector(state => state.appConfigReducer.myProfile)
    const userProfile = useSelector(state => state.postReducer.userProfile) 
    
     useEffect(()=> {
        dispatch(getUserProfile({
            userId: params.userId
        }))
        setIsMyProfile(myProfile._id === params.userId )
     },[params])


    return (
    <div className='Profile'>
        <div className="container">
            <CreatePost />
            <div className="right-part">
                {userProfile?.posts?.map(post => <Post post = {post}  key = {post._id}/> )}
            </div>
            <div className="left-part">
                <div className="profile-card">
                    <img className='profile-img' src={userProfile?.avatar?.url} alt="" />
                    <h3 className="user-name">{userProfile.name}</h3>
                    <div className="follower-info">
                        <h4>{`${userProfile.followers.length()} followers`}</h4>
                        <h4>{`${userProfile.followings.length()} followings`}</h4>
                    </div>
                    {!isMyProfile && <button className="hover-link follow-link">Follow</button>}
                    {isMyProfile && <button className='update-profile btn-secondary' onClick={() => {navigate('./updateProfile')}} >Update Profile</button>}
                </div>
            </div>
        </div>
      
    </div>
  )
}

export default Profile
