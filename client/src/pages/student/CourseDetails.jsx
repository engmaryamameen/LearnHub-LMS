import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../../context/AppContext';

const CourseDetails = () => {

  const {id} = useParams();

  const [courseData, setCourseData] = useState(null);

  const {allCourses} = useContext(AppContext);

  const fetcheCourseData = async ()=>{
    const findCourse = allCourses.find(course => course._id === id);
    setCourseData(findCourse);
  }

  useEffect(()=>{
    fetcheCourseData();
  },[])

  return (
    <div>
      {/* left column */}
      <div className='flex md:flex-row flex-col-reverse gap-10 relative items-start justify-between md:px-36 px-8 md:placeholder-teal-300 pt-20 text-left'>

        <div className='absolute top-0 left-0 w-full h-section-height -z-1 bg-gradient-to-b from-cyan-100/70'></div>

      </div>

      {/* right column */}
      <div></div>
    </div>
  )
}

export default CourseDetails
