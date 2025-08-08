import React from 'react'
import { assets } from '../../assets/assets'
import SearchBar from './SearchBar'
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <div className='relative min-h-screen flex flex-col items-center justify-center w-full px-4 sm:px-6 lg:px-8 py-20'>
      {/* Background Pattern */}
      <div className='absolute inset-0 opacity-5'>
        <div className='absolute inset-0' style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      {/* Main Content */}
      <div className='relative z-10 max-w-6xl mx-auto text-center space-y-8'>
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className='inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4'
        >
          <span className='w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse'></span>
          Join 50,000+ learners worldwide
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className='text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-tight max-w-5xl mx-auto'
        >
          Empower your future with courses designed{' '}
          <span className='relative inline-block'>
            <span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600'>
              to fit your choice
            </span>
            <motion.svg
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: 1 }}
              className='absolute -bottom-2 left-0 w-full h-4'
              viewBox='0 0 300 20'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M10 10 Q75 5 150 10 T290 10'
                stroke='url(#gradient)'
                strokeWidth='3'
                strokeLinecap='round'
              />
              <defs>
                <linearGradient id='gradient' x1='0%' y1='0%' x2='100%' y2='0%'>
                  <stop offset='0%' stopColor='#3B82F6' />
                  <stop offset='100%' stopColor='#6366F1' />
                </linearGradient>
              </defs>
            </motion.svg>
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className='text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed'
        >
          We bring together world-class instructors, interactive content, and a supportive
          community to help you achieve your personal and professional goals.
        </motion.p>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className='flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500'
        >
          <div className='flex items-center space-x-2'>
            <div className='w-2 h-2 bg-green-500 rounded-full'></div>
            <span>500+ Courses</span>
          </div>
          <div className='flex items-center space-x-2'>
            <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
            <span>Expert Instructors</span>
          </div>
          <div className='flex items-center space-x-2'>
            <div className='w-2 h-2 bg-purple-500 rounded-full'></div>
            <span>24/7 Support</span>
          </div>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className='w-full max-w-2xl mx-auto'
        >
          <SearchBar />
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className='flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-xs text-gray-500'
        >
          <div className='flex items-center space-x-2'>
            <svg className='w-4 h-4 text-green-500' fill='currentColor' viewBox='0 0 20 20'>
              <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
            </svg>
            <span>Free trial available</span>
          </div>
          <div className='flex items-center space-x-2'>
            <svg className='w-4 h-4 text-blue-500' fill='currentColor' viewBox='0 0 20 20'>
              <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
            </svg>
            <span>Certificate included</span>
          </div>
          <div className='flex items-center space-x-2'>
            <svg className='w-4 h-4 text-purple-500' fill='currentColor' viewBox='0 0 20 20'>
              <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
            </svg>
            <span>Lifetime access</span>
          </div>
        </motion.div>
      </div>

      {/* Floating Elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className='absolute top-20 right-10 hidden lg:block'
      >
        <div className='w-16 h-16 bg-blue-100 rounded-2xl rotate-12 flex items-center justify-center'>
          <svg className='w-8 h-8 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' />
          </svg>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.4 }}
        className='absolute bottom-20 left-10 hidden lg:block'
      >
        <div className='w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center'>
          <svg className='w-6 h-6 text-purple-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' />
          </svg>
        </div>
      </motion.div>
    </div>
  )
}

export default Hero
