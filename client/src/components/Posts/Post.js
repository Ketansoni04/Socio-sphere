import React from 'react'
import Avatar from '../Avatar/Avatar'
import { AiOutlineHeart } from "react-icons/ai";
import './Post.scss'
import { useDispatch } from 'react-redux'

function Post({post}) {
  
  const dispatch = useDispatch();

  async function handlePostLiked() {
      dispatch(likeAndUnlikePost({
        postId : post._id
      }))
  }
  
  return (
    <div className='Post'>
      <div className='heading'> 
            <Avatar src={post.owner.avatar.url}/>
            <h4>{post?.owner?.name}</h4>
      </div>
      <div className='content'>
        <img src={post.image} alt ='background image' />
      </div>
      <div className='footer'>
         <div className='like' onClick={handlePostLiked}>
           {post.isLiked ? <AiFillHeart  style={{color: "red"}}className = 'icon'/> : <AiOutlineHeart  className='icon'/>}
            <h4>{post.likeCount} </h4>
         </div>
         <p className="caption"></p>
         <h6 className="time-ago">post?.timeAgo</h6>
      </div>
    </div>
  )
}

export default Post
