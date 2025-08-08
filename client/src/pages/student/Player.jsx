import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'
import Loading from '../../components/student/Loading'
import Rating from '../../components/student/Rating'
import YouTube from 'react-youtube'
import humanizeDuration from 'humanize-duration'
import Footer from '../../components/student/Footer'

const Player = () => {
    const { courseId } = useParams()
    const {enrolledCourses, calculateChapterTime, backendUrl, getAccessToken, userData, fetchUserEnrolledCourses} = useContext(AppContext)
    const [courseData, setCourseData] = useState(null)
    const [currentLecture, setCurrentLecture] = useState(null)
    const [progressData, setProgressData] = useState(null)
    const [openSections, setOpenSections] = useState({})
    const [playerData, setPlayerData] = useState(null)
    const [initialRating, setInitialRating] = useState(0)

    const fetchCourseData = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/course/${courseId}`)
            if (data.success) {
                setCourseData(data.courseData)
                if (data.courseData.courseContent.length > 0 && data.courseData.courseContent[0].chapterContent.length > 0) {
                    setCurrentLecture(data.courseData.courseContent[0].chapterContent[0])
                }
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const updateProgress = async (lectureId) => {
        try {
            const token = await getAccessToken();
            if (!token) {
                toast.error('Authentication required')
                return
            }

            const { data } = await axios.post(`${backendUrl}/api/user/update-course-progress`, {
                courseId,
                lectureId
            }, {
                headers: { Authorization: `Bearer ${token}` }
            })

            if (data.success) {
                fetchUserEnrolledCourses()
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const getProgress = async () => {
        try {
            const token = await getAccessToken();
            if (!token) {
                toast.error('Authentication required')
                return
            }

            const { data } = await axios.post(`${backendUrl}/api/user/get-course-progress`, {
                courseId
            }, {
                headers: { Authorization: `Bearer ${token}` }
            })

            if (data.success) {
                setProgressData(data.progressData)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const addRating = async (rating) => {
        try {
            const token = await getAccessToken();
            if (!token) {
                toast.error('Authentication required')
                return
            }

            const { data } = await axios.post(`${backendUrl}/api/user/add-rating`, {
                courseId,
                rating
            }, {
                headers: { Authorization: `Bearer ${token}` }
            })

            if (data.success) {
                toast.success('Rating added successfully')
                fetchCourseData()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const toggleSection = (index) => {
        setOpenSections(prev => ({
            ...prev,
            [index]: !prev[index]
        }))
    }

    const handleRate = (rating) => {
        setInitialRating(rating)
        addRating(rating)
    }

    const markLectureAsCompleted = async (lectureId) => {
        try {
            await updateProgress(lectureId)
            await getProgress()
        } catch (error) {
            toast.error('Failed to mark lecture as completed')
        }
    }


  useEffect(()=>{
	fetchCourseData();
	getProgress();
  },[])

	// Check if user is enrolled in this course
	const isEnrolled = enrolledCourses?.some(course => course._id === courseId)

	if (!isEnrolled) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
					<p className="text-gray-600 mb-6">You need to enroll in this course to access its content.</p>
					<button 
						onClick={() => window.history.back()} 
						className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
					>
						Go Back
					</button>
				</div>
			</div>
		)
	}

	return courseData ? (
		<>
			<div className="p-4 sm:p-10 flex flex-col-reverse md:grid md:grid-cols-2 gap-10 md:px-36">
				{/* Left column */}
				<div className="text-gray-800">
					<h2 className="text-xl font-semibold">Course Structure</h2>
					<div className="pt-5">
						{courseData &&  courseData.courseContent.map((chapter, index) => (
							<div
								className="border border-gray-300 bg-white mb-2 rounded"
								key={index}
							>
								<div
									className="flex items-center justify-between px-4 py-3 cursor-pointer select-none"
									onClick={() => toggleSection(index)}
								>
									<div className="flex items-center gap-2">
										<img
											className={`transform transition-transform ${
												openSections[index] ? "rotate-180" : ""
											}`}
											src={assets.down_arrow_icon}
											alt="down_arrow_icon"
										/>
										<p className="font-medium md:text-base text-sm">
											{chapter.chapterTitle}
										</p>
									</div>
									<p className="text-sm md:text-default">
										{chapter.chapterContent.length} lectures -{" "}
										{calculateChapterTime(chapter)}{" "}
									</p>
								</div>

								<div
									className={`overflow-hidden transition-all duration-300 ${
										openSections[index] ? "max-h-9g" : "max-h-0"
									}`}
								>
									<ul className="list-disc md:pl-10 pl-4 pr-4 py-2 text-gray-600 border-t border-gray-300">
										{chapter.chapterContent.map((lecture, i) => (
											<li key={i} className="flex items-start gap-2 py-1">
												<img onClick={() =>
																	setPlayerData({
                                    ...lecture, chapter: index + 1, lecture: i+1
                                  })}

													className="w-4 h-4 mt-1 cursor-pointer"
													src={progressData && progressData.lectureCompleted.includes(lecture.lectureId) ? assets.blue_tick_icon : assets.play_icon}
													alt="play_icon"
												/>
												<div className="flex items-center justify-between w-full text-gray-800 text-xs md:text-default">
													<p>{lecture.lectureTitle}</p>
													<div className="flex gap-2">
														{lecture.lectureUrl && (
															<p
																onClick={() =>
																	setPlayerData({
                                    ...lecture, chapter: index + 1, lecture: i+1
                                  })
																}
																className="text-blue-500 cursor-pointer"
															>
																Watch
															</p>
														)}
														<p>
															{humanizeDuration(
																lecture.lectureDuration * 60 * 1000,
																{ units: ["h", "m"] }
															)}
														</p>
													</div>
												</div>
											</li>
										))}
									</ul>
								</div>
							</div>
						))}
					</div>

            <div className=" flex items-center gap-2 py-3 mt-10 ">
              <h1 className="text-xl font-bold">Rate this Course:</h1>
              <Rating initialRating={initialRating} onRate={handleRate}/>
            </div>


				</div>

				{/* right column */}
				<div className="md:mt-10">
          {playerData ? (
            <div className="">
              <YouTube 
                videoId={playerData.lectureUrl.split('/').pop()} 
                iframeClassName="w-full aspect-video"
                opts={{
                  width: '100%',
                  height: '100%',
                  playerVars: {
                    autoplay: 0,
                  },
                }}
              />
              
              <div className="flex justify-between items-center mt-1">
                <p>{playerData.chapter}.{playerData.lecture} {playerData.lectureTitle} </p>
                <button onClick={() => markLectureAsCompleted(playerData.lectureId)} className="text-blue-600">{progressData && progressData.lectureCompleted.includes(playerData.lectureId) ? 'Completed' : 'Mark As Complete'}</button>
              </div>
            </div>
          ) 
          :  
          <img src={courseData ? courseData.courseThumbnail : ''} alt="courseThumbnail" />
        }
        </div>
			</div>
      <Footer/>
		</>
	)
	: <Loading/>;
};

export default Player;
