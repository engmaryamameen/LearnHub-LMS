import React from 'react'
import { assets } from '../../assets/assets'
import { useAuth } from "@/context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const CallToAction = () => {
  const { user } = useAuth();
	const navigate = useNavigate();
  
  return (
    <div className='flex flex-col items-center gap-4 pt-10 pb-24 px-8 md:px-0'>
      <h1 className='text-xl md:text-4xl text-gray-800 font-semibold'>Learn anything, anytime, anywhere</h1>
      <p className='text-gray-500 sm:text-sm'>Whether you're a student looking to enhance your skills or an educator wanting to share knowledge, LearnHub LMS is the perfect platform for you.

Get Started</p>
      <div className='flex items-center font-medium gap-6 mt-4'>
        {user ? (
					<a href='#' className="px-10 py-3 rounded-md text-white bg-blue-600"> Get Started</a>
				) : (
					<>
						
						<button
							onClick={() => navigate('/signup')}
							className="px-6 py-3 rounded-md text-blue-600 bg-white border border-blue-600"
						>
							Create Account
						</button>
					</>
        )}
        <Link to="/about">
        <button className='flex items-center gap-2'>Learn more <img src={assets.arrow_icon} alt="arrow_icon" /></button>
        </Link>
      </div>
    </div>
  )
}

export default CallToAction
