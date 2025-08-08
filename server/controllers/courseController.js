import Course from "../models/Course.js";
import User from "../models/User.js";

// get all courses

export const getAllCourse = async (req,res) => {
    try {
        const courses = await Course.find({isPublished: true}).select(['-courseContent','-enrolledStudents'])
        
        // Get educator details for each course
        const coursesWithEducators = await Promise.all(
            courses.map(async (course) => {
                try {
                    const educator = await User.findOne({ supabaseId: course.educator }).select('firstName lastName email imageUrl')
                    return {
                        ...course.toObject(),
                        educator: educator || { firstName: 'Unknown', lastName: 'Educator', email: '', imageUrl: '' }
                    }
                } catch (error) {
                    console.error('Error fetching educator for course:', course._id, error)
                    return {
                        ...course.toObject(),
                        educator: { firstName: 'Unknown', lastName: 'Educator', email: '', imageUrl: '' }
                    }
                }
            })
        )

        res.json ({success: true, courses: coursesWithEducators})
    } catch (error) {
        res.json({success: false, message:error.message})
    }
}


// get course by id

export const getCourseId = async(req,res)=>{
    const {id} = req.params 
    try {

        const courseData = await Course.findById(id);
        
        if (!courseData) {
            return res.json({success: false, message: 'Course not found'})
        }

        // Get educator details
        try {
            const educator = await User.findOne({ supabaseId: courseData.educator }).select('firstName lastName email imageUrl')
            courseData.educator = educator || { firstName: 'Unknown', lastName: 'Educator', email: '', imageUrl: '' }
        } catch (error) {
            console.error('Error fetching educator for course:', courseData._id, error)
            courseData.educator = { firstName: 'Unknown', lastName: 'Educator', email: '', imageUrl: '' }
        }

        // Remove lecture Url if previewFree is false

        courseData.courseContent.forEach(chapter => {
            chapter.chapterContent.forEach(lecture => {
                if(!lecture.isPreviewFree){
                    lecture.lectureUrl = "";
                }
            })
        })

        res.json({success:true, courseData})
        
    } catch (error) {
        res.json({success: false, message:error.message})
    }
}