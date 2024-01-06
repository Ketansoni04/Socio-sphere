import React, { useEffect } from 'react'
import Follower from '../Follower/Follower'
import "./Feed.scss"
import Post from '../Posts/Post'
import { useDispatch, useSelector } from 'react-redux'
import { getFeedData } from '../../redux/slices/feedDataSlice'

function Feed() {
  

  const feedData = useSelector(state => state.feedDataReducer.feedData  )
  const diapatch = useDispatch()

  useEffect(() => {
    diapatch(getFeedData())
  },[diapatch])
  
  return (
    <div className='Feed'>
        <div className='container'>
            <div className='right-part'>
              {feedData?.posts?.map(post => <Post key = {post._id} post={post} />)}
            </div>
            <div className='left-part'>
                <div className='following'>
                  <h3 className='title'>You are Following</h3>
                     {feedData?.followers?.map(user => <Follower user={user} />)}
                </div>
                <div className='suggestions'>
                  <h3 className='title'>Suggestions</h3>
                  {feedData?.notFollowersId?.map(user => <Follower user={user} />)}
                </div>
            </div>
        </div>
    </div>
  )
}

export default Feed
