import React, { useEffect, useState } from 'react'
import './UpdateProfile.scss'
import { updateMyProfile } from '../../redux/slices/appConfigSlice';
import { useDispatch, useSelector } from 'react-redux';


function UpdateProfile() {
   const myProfile = useSelector((state) => state.appConfigReducer.myProfile)
   const dispatch = useDispatch(); 
   
   
   const [name,setName] = useState('');
    const [bio,setBio] = useState('');
    const [userImg,setUserImg] = useState('');
    

    useEffect(() => {
         setName(myProfile?.name || '')
         setBio(myProfile?.bio || '')
         setUserImg(myProfile?.avatar.url || '')
    },[myProfile])

    function handleImageChange(e) {
        const file = e.target.files[0]
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file)
        fileReader.onload = () => {
            if(fileReader.readyState === fileReader.DONE){
                setUserImg(fileReader.result)
            }
        }
    }

    function  handleSubmit(e) {
        e.preventDefault()
        dispatch(updateMyProfile({
            name,
            bio,
            userImg
        }))
    }
    return (
    <div className='UpdateProfile'>
        <div className="container">
            <div className="left-part">
                <div className="input-user-img">
                    <label htmlFor="InpuImg" className='labelImg'>
                        <img src={userImg} alt={name} />
                    </label>
                    <input className = "inputImg" id = "inputImg" type="file" accept='image/*' onChange={handleImageChange}/>
                </div>
            </div>
            <div className="right-part">
                <form>
                    <input type="text" placeholder='Your Name' onChange={(e) => setName(e.target.value)}/>
                    <input type="text" placeholder='Your Bio'onChange={(e) => setBio(e.target.value)}/>
                    <input type="submit" className='btn-primary' onClick={handleSubmit}/>
                </form>

                <button className="delete-account btn-primary" >Delete Account</button>
            </div>
        </div>
    </div>
  )
}

export default UpdateProfile
