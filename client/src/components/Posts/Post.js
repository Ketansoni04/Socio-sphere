import React from 'react'
import { useNavigate } from 'react-router-dom';
import Avatar from '../Avatar/Avatar'
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import './Post.scss'
import { useDispatch } from 'react-redux'
import { TOAST_SUCCESS } from '../../App';
import {showToast} from '../../redux/slices/appConfigSlice'
import { likeAndUnlikePost } from '../../redux/slices/postSlice';

function Post({post}) {
  const navigate = useNavigate()
  const dispatch = useDispatch();

  async function handlePostLiked() {
    dispatch(showToast({
      type: TOAST_SUCCESS,
      message: 'liked or unliked'

    }))  
    dispatch(likeAndUnlikePost({
        postId : post._id
      }))
  }
  
  return (
    <div className='Post'>
      <div className='heading' onClick={() => navigate(`/profile/${post.owner._id}`)}> 
            <Avatar src={post.owner.avatar.url}/>
            <h4>{post?.owner?.name}</h4>
      </div>
      <div className='content'>
        <img src={post.image} alt ='background image' />
      </div>
      <div className='footer'>
         <div className='like' onClick={handlePostLiked}>
           {post.isLiked ? <AiFillHeart  style={{color: "red"}} className = 'icon'/> : <AiOutlineHeart  className='icon'/>}
            <h4>{post.likeCount} </h4>
         </div>
         <p className="caption"></p>
         <h6 className="time-ago">post?.timeAgo</h6>
      </div>
    </div>
  )
}

export default Post
