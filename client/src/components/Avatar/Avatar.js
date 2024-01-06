import React from 'react'
import profileImg from '../../assests/meerkat.png'
import './Avatar.scss'

function Avatar({src}) {
  return (
    <div className='Avatar'>
        <img src={src ? src : profileImg} alt='image' />
    </div>
  )
}

export default Avatar
