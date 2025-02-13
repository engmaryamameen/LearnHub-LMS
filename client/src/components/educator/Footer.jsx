import React from 'react'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className='flex md:flex-row flex-col-reverse items-center justify-between text-left w-full px-8 border-t'>
      <div className='flex items-center gap-4'>
        <img className='hidden md:block w-20' src={assets.logo} alt="" />
        <div className='hidden md:block h-7 w-px bg-gray-500/60'></div>
        <p className='py-4 text-center text-xs md:text-sm text-gray-500' >
        Copyright 2025 © Edemy. All Right Reserved.
        </p>

      </div>


      <div className='flex items-center gap-3 max-md:mt-4'>
        <Link to='https://www.facebook.com/profile.php?id=100026766931684'><img src={assets.facebook_icon} alt="" /></Link>
        <Link to='https://x.com/gps_96169'><img src={assets.twitter_icon} alt="" /></Link>
        <Link to='https://www.linkedin.com/in/gyan-pratap-singh-275785236/'><img src={assets.instagram_icon} alt="" /></Link>
      </div>
    </footer>
  )
}

export default Footer
