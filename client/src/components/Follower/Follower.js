import React, { useEffect, useState } from 'react'
import Avatar from '../Avatar/Avatar'
import './Follower.scss'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { followAndUnfollowUser, getFeedData } from '../../redux/slices/feedDataSlice'



function Follower({user}) {
  const navigate = useNavigate()
  const feedData = useSelector((state) => state.feedDataReducer.feedData)
  const dispatch = useDispatch()
  const [isFollowing,setIsFollowing] = useState();
  
  useEffect(() => {
    setIsFollowing(feedData?.followings?.find((item) => item._id === user._id))
  })

  function handleUserFollow() {
    dispatch(followAndUnfollowUser({
      userIdToFollow : user._id
    }))
   dispatch(getFeedData())
  }


  return (
    <div className='Followers'>
        <div className="profile-info"  onClick={() => navigate(`/profile/${user?._id}`)}>
            <Avatar src = {user?.avatar?.url}/>
            <h4 className="name">{user?.name}</h4>
        </div>
        <h5 onClick={handleUserFollow}
                className={
                    isFollowing ? "hover-link follow-link" : "btn-primary"
                }
            >
                {isFollowing ? "Unfollow" : "Follow"}
            </h5>
        </div>
  )
}

export default Follower
