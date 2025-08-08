import React, { useContext, useState } from 'react'
import { assets } from '../../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const AddCourse = () => {
    const { backendUrl, getAccessToken } = useContext(AppContext)
    const [courseData, setCourseData] = useState({
        courseTitle: '',
        courseDescription: '',
        coursePrice: '',
        discount: '',
        courseThumbnail: '',
        courseContent: [],
        playlistLink: ''
    })
    const [imageFile, setImageFile] = useState(null)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const token = await getAccessToken();
            if (!token) {
                toast.error('Authentication required')
                return
            }

            const formData = new FormData()
            formData.append('image', imageFile)
            formData.append('courseData', JSON.stringify(courseData))

            const { data } = await axios.post(`${backendUrl}/api/educator/add-course`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            })

            if (data.success) {
                toast.success(data.message)
                navigate('/educator')
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='flex flex-col gap-4 p-4'>
            <h1 className='text-2xl font-bold'>Add New Course</h1>
            
            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                <div className='flex flex-col gap-1'>
                    <label>Course Title:</label>
                    <input 
                        type="text" 
                        placeholder='Enter course title'
                        value={courseData.courseTitle}
                        onChange={(e) => setCourseData({...courseData, courseTitle: e.target.value})}
                        className='outline-none py-2 px-3 rounded border border-gray-500' 
                        required 
                    />
                </div>

                <div className='flex flex-col gap-1'>
                    <label>Course Description:</label>
                    <textarea 
                        placeholder='Enter course description'
                        value={courseData.courseDescription}
                        onChange={(e) => setCourseData({...courseData, courseDescription: e.target.value})}
                        className='outline-none py-2 px-3 rounded border border-gray-500 h-32' 
                        required 
                    />
                </div>

                <div className='flex gap-4'>
                    <div className='flex flex-col gap-1'>
                        <label>Course Price:</label>
                        <input 
                            type="number" 
                            placeholder='0'
                            value={courseData.coursePrice}
                            onChange={(e) => setCourseData({...courseData, coursePrice: e.target.value})}
                            className='outline-none py-2 px-3 rounded border border-gray-500 w-32' 
                            required 
                        />
                    </div>

                    <div className='flex flex-col gap-1'>
                        <label>Discount %:</label>
                        <input 
                            type="number" 
                            placeholder='0'
                            min="0"
                            max="100"
                            value={courseData.discount}
                            onChange={(e) => setCourseData({...courseData, discount: e.target.value})}
                            className='outline-none py-2 px-3 rounded border border-gray-500 w-32' 
                            required 
                        />
                    </div>
                </div>

                <div className='flex flex-col gap-1'>
                    <label>Course Thumbnail:</label>
                    <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => setImageFile(e.target.files[0])}
                        className='outline-none py-2 px-3 rounded border border-gray-500' 
                        required 
                    />
                </div>

                <div className='flex flex-col gap-1'>
                    <label>YouTube Playlist Link (Optional):</label>
                    <input 
                        type="url" 
                        placeholder='https://www.youtube.com/playlist?list=...'
                        value={courseData.playlistLink}
                        onChange={(e) => setCourseData({...courseData, playlistLink: e.target.value})}
                        className='outline-none py-2 px-3 rounded border border-gray-500' 
                    />
                    <p className='text-sm text-gray-500'>Add a YouTube playlist link for additional course content</p>
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className='bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50'
                >
                    {loading ? 'Adding Course...' : 'Add Course'}
                </button>
            </form>
        </div>
    )
}

export default AddCourse
