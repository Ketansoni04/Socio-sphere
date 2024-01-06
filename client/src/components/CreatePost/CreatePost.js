import React, { useState } from 'react'
import './CreatePost.scss'
import Avatar from '../Avatar/Avatar'
import backgroundImg from "../../assests/meerkat.png"
import {BsCardImage} from "react-icons"
import { axiosClient } from '../../utils/axiosClient'
import {useDispatch, useSelector} from 'react-redux'
import { setLoading } from '../../redux/slices/appConfigSlice'
import getUserProfile from '../../redux/slices/postSlice'

function CreatePost() {
    const dispatch = useDispatch()
    
    const [postImg,setPostImg] = useState("");
    const [caption,setCaption] = useState("")

    const myProfile = useSelector(state => state.appConfigReducer.myProfile)

    function handleImageChange(e){
        const file = e.target.files[0]
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file)
        fileReader.onload = () => {
            if(fileReader.readyState === fileReader.DONE){
                setPostImg(fileReader.result);
            }
        }
    }
    
    const  handlePostSubmit = async() => {
        try {
            dispatch(setLoading(true))
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
            dispatch(setLoading(false))
            setCaption('')
            setPostImg('')

        }
        
    
    }
    
    (
    <div className='CreatePost'>
        <div className="left-part">
            <Avatar />
        </div>
        <div className="right-part">
            <input  value={caption} type="text" className='captionInput' placeholder='Whats on your mind' onChange={(e) => {setCaption(e.target.valyue)}}/>
            {postImg && <div className="img-container">
                <img src={backgroundImg} alt=""  className='post-img'/>
            </div>}
            <div className="bottom-part">
                <div className="input-post-img">
                <label htmlFor="InpuImg" className='labelImg'>
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
