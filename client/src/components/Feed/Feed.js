import React, { useEffect } from 'react'
import Follower from '../Follower/Follower'
import "./Feed.scss"
import Post from '../Posts/Post'
import { useDispatch, useSelector } from 'react-redux'
import { getFeedData } from '../../redux/slices/feedDataSlice'

function Feed() {
  
  const feedData = useSelector((state) => state.feedDataReducer.feedData  )
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getFeedData())
  },[dispatch])
  
  return (
    <div className='Feed'>
        <div className='container'>
            <div className='left-part'>
              {feedData?.posts?.map(post => <Post key = {post._id} post={post} />)}
            </div>
            <div className='right-part'>
                <div className='following'>
                  <h3 className='title'>You are Following</h3>
                     {feedData?.followings?.map(user => <Follower key = {user._id}   user={user} />)}
                </div>
                <div className='suggestions'>
                  <h3 className='title'>Suggestions</h3>
                  {feedData?.notFollowingsId?.map(user => <Follower key = {user._id} user={user} />)}
                </div>
            </div>
        </div>
    </div>
  )
}

export default Feed
