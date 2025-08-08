import { createContext, useContext, useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets";
import { data, useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration"
import { useAuth } from '@/context/AuthContext'
import axios from 'axios'
import {  toast } from 'react-toastify';
import { supabase } from '@/config/supabase';

export const AppContext = createContext()

export const AppContextProvider = (props)=>{

    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
    const currency = import.meta.env.VITE_CURRENCY;
    const navigate = useNavigate();

    const { user } = useAuth();

    const [allCourses, setAllCourses] = useState([])
    const [isEducator, setIsEducator] = useState(false)
    const [enrolledCourses, setEnrolledCourses] = useState([])
    const [userData, setUserData] = useState(null)

    // fetch all courses 
    const fetchAllCourses = async ()=>{
        try {
            const {data} = await axios.get(backendUrl + '/api/course/all');
            if(data.success)
            {
                setAllCourses(data.courses)
            }else{
                toast.error(data.message);
            }
            
        } catch (error) {
            toast.error(error.message)
        }
    }

    // fetch user data
    const fetchUserData = async ()=>{
        if (!user) return;

        try {
            // Get user profile from our database
            const {data} = await axios.get(`${backendUrl}/api/user/profile/${user.id}`)
        
            if(data.success){
                setUserData(data.user)
                if(data.user.role === 'educator'){
                    setIsEducator(true);
                }
            }else{
                toast.error(data.message)
            }

        } catch (error) {
            console.error('Error fetching user data:', error)
            // If user doesn't exist in our database, create them
            if (error.response?.status === 404) {
                try {
                    const userData = {
                        id: user.id,
                        email: user.email,
                        first_name: user.user_metadata?.first_name || '',
                        last_name: user.user_metadata?.last_name || '',
                        role: user.user_metadata?.role || 'student'
                    }
                    
                    const response = await axios.post(`${backendUrl}/api/user/register`, userData)
                    if (response.data.success) {
                        setUserData(response.data.user)
                        if (response.data.user.role === 'educator') {
                            setIsEducator(true)
                        }
                    }
                } catch (registerError) {
                    console.error('Error registering user:', registerError)
                }
            }
        }
    }

    // Function to calculate average rating of course
    const calculateRating = (course) => {
        if(course.courseRatings.length === 0){
            return 0;
        }
        let totalRating = 0;
        course.courseRatings.forEach(rating =>{
            totalRating += rating.rating;
        })
        return Math.floor(totalRating / course.courseRatings.length)
    }

    // function to calculate course chapter time
    const calculateChapterTime = (chapter) => {
        let time = 0;
        chapter.chapterContent.map((lecture) => time += lecture.lectureDuration)
        return humanizeDuration(time * 60 * 1000, {units: ["h", "m"]})
    }

    // Function to calculate course Duratuion
    const calculateCourseDuration = (course)=>{
        let time = 0 ;
        course.courseContent.map((chapter)=> chapter.chapterContent.map(
            (lecture)=> time += lecture.lectureDuration 
        ))

        return humanizeDuration(time * 60 * 1000, {units: ["h", "m"]}) 
    }

    // Function to calculate to no. of lectures in the course
    const calculateNoOfLectures = (course) => {
        let totalLectures = 0;
        course.courseContent.forEach(chapter => {
            if(Array.isArray(chapter.chapterContent)){
                totalLectures += chapter.chapterContent.length;
            }
        });
        return totalLectures;
    }

    // Fetch user enrolled courses
    const fetchUserEnrolledCourses = async () => {
        if (!user) return;
        
        try {
            // Get the current session to access the access token
            const { data: { session } } = await supabase.auth.getSession()
            const accessToken = session?.access_token
            
            if (!accessToken) {
                console.log('No access token available')
                return
            }
            
            const response = await axios.get(`${backendUrl}/api/user/enrolled-courses`, {
                headers: { 
                    Authorization: `Bearer ${accessToken}` 
                }
            });
    
            if (response.data && response.data.enrolledCourses) {
                setEnrolledCourses(response.data.enrolledCourses.reverse());
            } else {
                toast.error(response.data?.message || "No enrolled courses found.");
            }
        } catch (error) {
            console.error("Error fetching courses:", error);
            toast.error(error.response?.data?.message || error.message);
        }
    };
    
    useEffect(()=>{
        fetchAllCourses()
    },[])

    useEffect(()=>{
        if(user){
            fetchUserData()
            fetchUserEnrolledCourses()
        }
    },[user])

    // Helper function to get access token
    const getAccessToken = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession()
            return session?.access_token
        } catch (error) {
            console.error('Error getting access token:', error)
            return null
        }
    }

    const value = {
        currency,
        allCourses, 
        navigate, 
        isEducator, 
        setIsEducator,
        calculateRating,
        calculateChapterTime,
        calculateCourseDuration,
        calculateNoOfLectures,
        fetchUserEnrolledCourses, 
        setEnrolledCourses,
        enrolledCourses,
        backendUrl, 
        userData, 
        setUserData, 
        fetchAllCourses,
        getAccessToken
    }

    return (
        <AppContext.Provider value={value} >
            {props.children}
        </AppContext.Provider>
    )
}