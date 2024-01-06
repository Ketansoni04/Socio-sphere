import React, { useEffect, useState } from 'react'
import Avatar from '../Avatar/Avatar'
import './Follower.scss'
import { useDispatch, useSelector } from 'react-redux'
import { followAndunfollow, getFeedData } from '../../redux/slices/feedDataSlice'

function Follower({user}) {
  
  const feedData = useSelector(state => state.feedDataReducer.feedData  )
  const dispatch = useDispatch()
  const [isFollowing,setIsFollowing] = useState();
  
  useEffect(() => {
    setIsFollowing(feedData?.following?.find(item => item._id === user._id))
  })

  function handleUserFollow() {
    dispatch(followAndunfollow({
      userIdToFollow : user._id
    }))
  }


  return (
    <div className='Followers'>
        <div className="profile-info">
            <Avatar src = {user.avatar?.url}/>
            <h4 className="name">{}</h4>
        </div>
        
        <h5 onClick = {handleUserFollow} className={isFollowing ? 'hover-link follow-link' : 'btn-primary' }>{isFollowing ? 'unfollow' : 'follow'}</h5>
    </div>
  )
}

export default Follower
