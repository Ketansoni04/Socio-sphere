import React, { useState } from 'react'
import './CreatePost.scss'
import Avatar from '../Avatar/Avatar'
import { BsCardImage } from "react-icons/bs";
import { axiosClient } from '../../utils/axiosClient'
import {useDispatch, useSelector} from 'react-redux'
import getUserProfile from '../../redux/slices/postSlice'

function CreatePost() {
    const dispatch = useDispatch()
    
    const [postImg,setPostImg] = useState("");
    const [caption,setCaption] = useState("")

    const myProfile = useSelector((state) => state.appConfigReducer.myProfile)

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file)
        fileReader.onload = () => {
            if(fileReader.readyState === fileReader.DONE){
                setPostImg(fileReader.result);
                console.log("img data", fileReader.result);
            }
        }
    }
    
    const  handlePostSubmit = async() => {
        try {
            const result = await axiosClient.post('./posts', {
                caption,
                postImg
            }) 
            console.log('post done', result);
            dispatch(getUserProfile({
                userId: myProfile?._id
            }))
        } catch (e) {
            console.log(e);
        } finally{
            setCaption('')
            setPostImg('')

        }
        
    
    }
    
    return (
    <div className='CreatePost'>
        <div className="left-part">
            <Avatar  src={myProfile?.avatar?.url}/>
        </div>
        <div className="right-part">
            <input  value={caption} type="text" className='captionInput' placeholder='Whats on your mind' onChange={(e) => {setCaption(e.target.value)}}/>
            {postImg && (<div className="img-container">
                <img src={postImg} alt="post-img"  className='post-img'/>
            </div>)}
            <div className="bottom-part">
                <div className="input-post-img">
                <label htmlFor="inputImg" className='labelImg'>
                        <BsCardImage />
                    </label>
                    <input className = "inputImg" id = "inputImg" type="file" accept='image/*' onChange={handleImageChange}/>
               
                </div>
                <button className='post-btn btn-primary' onClick={handlePostSubmit}>Post</button>
            </div>
        </div>
      
    </div>
  )
}

export default CreatePost
