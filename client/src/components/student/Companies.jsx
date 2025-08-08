import React from 'react'
import { assets } from '../../assets/assets'
import { motion } from "framer-motion";

const Companies = () => {
  const companies = [
    { logo: assets.microsoft_logo, name: 'Microsoft', delay: 0.1, color: 'from-blue-500 to-blue-600' },
    { logo: assets.walmart_logo, name: 'Walmart', delay: 0.2, color: 'from-blue-600 to-blue-700' },
    { logo: assets.accenture_logo, name: 'Accenture', delay: 0.3, color: 'from-purple-500 to-purple-600' },
    { logo: assets.adobe_logo, name: 'Adobe', delay: 0.4, color: 'from-red-500 to-red-600' },
    { logo: assets.paypal_logo, name: 'PayPal', delay: 0.5, color: 'from-blue-500 to-indigo-600' }
  ];

  return (
    <div className='py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50'>
      <div className='max-w-7xl mx-auto'>
        {/* Enhanced Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className='text-center mb-16'
        >
          <div className='inline-flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-blue-200'>
            <div className='w-2 h-2 bg-blue-500 rounded-full animate-pulse'></div>
            <span>Trusted Worldwide</span>
          </div>
          
          <h2 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight'>
            Trusted by Leading{' '}
            <span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600'>
              Companies
            </span>
          </h2>
          
          <p className='text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed'>
            Join thousands of professionals from world-renowned companies who trust LearnHub for their learning journey
          </p>
        </motion.div>

        {/* Enhanced Companies Grid */}
        <div className='grid grid-cols-2 md:grid-cols-5 gap-6 lg:gap-8 mb-20'>
          {companies.map((company, index) => (
            <motion.div
              key={company.name}
              initial={{ opacity: 0, y: 40, scale: 0.8 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: company.delay, type: "spring", stiffness: 100 }}
              viewport={{ once: true }}
              whileHover={{ 
                y: -10,
                scale: 1.05,
                transition: { duration: 0.3 }
              }}
              className='group relative'
            >
              {/* Enhanced Company Logo Container */}
              <div className='relative bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden'>
                {/* Gradient Overlay on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${company.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-3xl`}></div>
                
                {/* Logo Container */}
                <div className='relative z-10'>
                  <img 
                    src={company.logo} 
                    alt={`${company.name} logo`} 
                    className='w-full h-12 object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110'
                  />
                </div>
                
                {/* Floating Elements */}
                <div className='absolute top-2 right-2 w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-0 group-hover:scale-100'></div>
                <div className='absolute bottom-2 left-2 w-2 h-2 bg-gradient-to-r from-pink-400 to-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 transform scale-0 group-hover:scale-100'></div>
                
                {/* Glow Effect */}
                <div className='absolute inset-0 bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/10 group-hover:via-purple-500/10 group-hover:to-pink-500/10 transition-all duration-500 rounded-3xl'></div>
              </div>

              {/* Enhanced Company Name */}
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: company.delay + 0.2 }}
                viewport={{ once: true }}
                className='text-center text-sm font-semibold text-gray-700 mt-4 group-hover:text-gray-900 transition-colors duration-300'
              >
                {company.name}
              </motion.p>
            </motion.div>
          ))}
        </div>

        {/* Enhanced Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-16'
        >
          <div className='text-center group'>
            <div className='relative inline-block'>
              <div className='text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-700 mb-3 group-hover:from-blue-500 group-hover:to-blue-600 transition-all duration-300'>
                50K+
              </div>
              <div className='absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 animate-pulse'></div>
            </div>
            <div className='text-gray-600 font-medium'>Active Learners</div>
          </div>
          
          <div className='text-center group'>
            <div className='relative inline-block'>
              <div className='text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-3 group-hover:from-indigo-500 group-hover:to-purple-500 transition-all duration-300'>
                500+
              </div>
              <div className='absolute -top-2 -right-2 w-4 h-4 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 animate-pulse'></div>
            </div>
            <div className='text-gray-600 font-medium'>Expert Courses</div>
          </div>
          
          <div className='text-center group'>
            <div className='relative inline-block'>
              <div className='text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-rose-600 mb-3 group-hover:from-pink-500 group-hover:to-rose-500 transition-all duration-300'>
                95%
              </div>
              <div className='absolute -top-2 -right-2 w-4 h-4 bg-pink-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 animate-pulse'></div>
            </div>
            <div className='text-gray-600 font-medium'>Success Rate</div>
          </div>
        </motion.div>

        {/* Enhanced Trust Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className='text-center'
        >
          <div className='inline-flex items-center space-x-3 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 px-6 py-3 rounded-full text-sm font-semibold border border-green-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105'>
            <div className='w-5 h-5 bg-green-500 rounded-full flex items-center justify-center'>
              <svg className='w-3 h-3 text-white' fill='currentColor' viewBox='0 0 20 20'>
                <path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd' />
              </svg>
            </div>
            <span>ISO 27001 Certified</span>
            <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></div>
          </div>
        </motion.div>

        {/* Additional Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          viewport={{ once: true }}
          className='mt-12 flex flex-wrap justify-center gap-6 text-sm text-gray-500'
        >
          <div className='flex items-center space-x-2'>
            <div className='w-2 h-2 bg-blue-500 rounded-full animate-pulse'></div>
            <span>SSL Secured</span>
          </div>
          <div className='flex items-center space-x-2'>
            <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></div>
            <span>24/7 Support</span>
          </div>
          <div className='flex items-center space-x-2'>
            <div className='w-2 h-2 bg-purple-500 rounded-full animate-pulse'></div>
            <span>Money Back Guarantee</span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Companies
