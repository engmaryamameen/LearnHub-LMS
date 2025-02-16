import {clerkClient} from '@clerk/express'
import Course from '../models/Course.js'
import {v2 as cloudinary} from 'cloudinary'
import { Purchase } from '../models/Purchase.js'
import User from '../models/User.js'


// Update role to educator
export const updateRoleToEducator = async (req,res)=>{
    try {
        const userId = req.auth.userId

        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata:{
                role: 'educator',
            }
        })

        res.json({success: true, message: 'You can publish a course now'})


    } catch (error) {
        res.json({success: false, message:error.message})
    }
}

//  Add new course 
// export const addCourse = async(req,res) =>{
//     try {
//         const {courseData} = req.body;
//         const imageFile = req.file;
//         const educatorId = req.auth.userId
//         console.log(educatoreId);
//         if(!imageFile){
//             return res.json({success: false, message:"Thumbnail Not Attached"})
//         }

//         const parsedCourseData = await JSON.parse(courseData)
//         parsedCourseData.educator = educatorId
//         const imageUpload = await cloudinary.uploader.upload(imageFile.path)
//         newCourse.courseThumbnail = imageUpload.secure_url
//         const newCourse = await Course.create(parsedCourseData)
//         await newCourse.save()
//         res.json({success: true, message: "Course Added"})



//     } catch (error) {
//         res.json({success: false, message:error.message})
//     }
// }

export const addCourse = async (req, res) => {
    try {
        const { courseData } = req.body;
        const imageFile = req.file;
        const educatorId = req.auth.userId;

        // console.log(educatorId);

        if (!imageFile) {
            return res.json({ success: false, message: "Thumbnail Not Attached" });
        }

        const parsedCourseData = JSON.parse(courseData);
        parsedCourseData.educator = educatorId;

        // Ensure 'isPublished' defaults to true
        // parsedCourseData.isPublished = parsedCourseData.isPublished ?? true;

        // Ensure all lectures have required fields
        // if (!parsedCourseData.courseContent?.every(chapter => 
        //     chapter.chapterContent?.every(lecture => lecture.lectureId && lecture.lectureurl)
        // )) {
        //     return res.json({ success: false, message: "Lecture ID and URL are required in all chapters." });
        // }

        // Upload image first
        const imageUpload = await cloudinary.uploader.upload(imageFile.path);
        parsedCourseData.courseThumbnail = imageUpload.secure_url;

        // Create course after ensuring image is uploaded
        const newCourse = await Course.create(parsedCourseData);
        await newCourse.save()

        res.json({ success: true, message: "Course Added", course: newCourse });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};




// Get educator courses

export const getEducatorCourses = async(req,res) => {
    try {
        // const educator = req.auth
        const educator = req.auth.userId
        const courses = await Course.find({educator})
        // console.log(req.auth);
        res.json({success: true, courses})
        
    } catch (error) {
        res.json({success: false, message:error.message})
    }
}

// get educatore dashboard data (ttal earnings, enrolled students, No. of courses)

export const educatorDashboardData = async(req,res) =>{
    try {
        const educator = req.auth.userId

        const courses = await Course.find({educator});
        const totalCourses = courses.length;

        const courseIds = courses.map(course => course._id)
        // calculate total earnings from purchases
        const purchases = await Purchase.find({
            courseId: {$in: courseIds},
            status: 'completed'
        });

        const totalEarnings =Math.round( purchases.reduce((sum, purchase) => sum + purchase.amount, 0)).toFixed(2)
        
        // collect unique enrolled students ids with their course title

        const enrolledStudentsData = [];
        for(const course of courses){
            const students = await User.find({
                _id: {$in: course.enrolledStudents}
            }, 'name imageUrl')

            students.forEach(student => {
                enrolledStudentsData.push({
                    courseTitle: course.courseTitle,
                    student
                });
            });
        }
        res.json({success: true, dashboardData: {
            totalEarnings,enrolledStudentsData, totalCourses
        }})
    } catch (error) {
        res.json({success: false, message:error.message})    
    }
}




// Get Enrolled Students Data with purchase data

export const getEnrolledStudentsData = async(req,res) =>{
    try {
        const educator = req.auth.userId;
        const courses = await Course.find({educator})
        const courseIds = courses.map(course => course._id)

        const purchases = await Purchase.find({
            courseId: {$in: courseIds},
            status: 'completed'
        }).populate('userId', 'name imageUrl').populate('courseId', 'courseTitle')

        const enrolledStudents = purchases.map(purchase => ({
            student: purchase.userId,
            courseTitle: purchase.courseId.courseTitle,
            purchaseDate: purchase.createdAt
        }));

        res.json({success: true, enrolledStudents});

    } catch (error) {
        res.json({success: false, message:error.message})
    }
}