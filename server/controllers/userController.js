import Stripe from "stripe"
import Course from "../models/Course.js"
import { Purchase } from "../models/Purchase.js"
import User from "../models/User.js"
import { CourseProgress } from "../models/CourseProgress.js"
import { supabase } from '../configs/supabase.js'

// Register new user
export const registerUser = async (req, res) => {
  try {
    const { id, supabaseId, email, first_name, last_name, role, phone } = req.body

    // Use either id or supabaseId
    const userId = id || supabaseId

    if (!userId || !email) {
      return res.status(400).json({ error: 'User ID and email are required' })
    }

    // Check if user already exists by email or supabaseId
    const existingUser = await User.findOne({ 
      $or: [{ email }, { supabaseId: userId }] 
    })
    
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' })
    }

    // Create new user in database
    const newUser = new User({
      supabaseId: userId,
      email,
      firstName: first_name || '',
      lastName: last_name || '',
      role: role || 'student',
      phone: phone || '',
      isVerified: false
    })

    await newUser.save()

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role
      }
    })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const { supabaseId } = req.params

    const user = await User.findOne({ supabaseId })
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        phone: user.phone,
        isVerified: user.isVerified
      }
    })
  } catch (error) {
    console.error('Get profile error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const { supabaseId } = req.params
    const updateData = req.body

    const user = await User.findOneAndUpdate(
      { supabaseId },
      updateData,
      { new: true, runValidators: true }
    )

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        phone: user.phone
      }
    })
  } catch (error) {
    console.error('Update profile error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Verify user email
export const verifyUserEmail = async (req, res) => {
  try {
    const { supabaseId } = req.params

    const user = await User.findOneAndUpdate(
      { supabaseId },
      { isVerified: true },
      { new: true }
    )

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json({
      success: true,
      message: 'Email verified successfully'
    })
  } catch (error) {
    console.error('Email verification error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Get all users (admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-__v')
    
    res.json({
      success: true,
      users: users.map(user => ({
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isVerified: user.isVerified,
        createdAt: user.createdAt
      }))
    })
  } catch (error) {
    console.error('Get all users error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Get users data
export const getUserData = async(req,res)=>{
    try {
        const userId = req.user.id // Using Supabase user ID
        const user = await User.findOne({ supabaseId: userId })
        if(!user){
            res.json({success: false, message:"User not found!"})
        }

        res.json({success: true, user});
    } catch (error) {
        res.json({success: false, message:error.message})
    }
}

// User enrolled course with lecture link

export const userEnrolledCourses = async (req,res)=>{
    try {
        const userId = req.user.id 
        const userData = await User.findOne({ supabaseId: userId })

        if (!userData) {
            return res.json({success: false, message: "User not found"})
        }

        // Process any pending purchases first
        try {
            const pendingPurchases = await Purchase.find({
                userId: userId,
                status: 'pending'
            });

            if (pendingPurchases.length > 0) {
                for (const purchase of pendingPurchases) {
                    const courseData = await Course.findById(purchase.courseId);
                    if (courseData && !userData.enrolledCourses.includes(courseData._id)) {
                        // Add course to user's enrolled courses
                        userData.enrolledCourses.push(courseData._id);
                        // Add user to course's enrolled students
                        courseData.enrolledStudents.push(userData.supabaseId);
                        
                        await courseData.save();
                    }
                    // Update purchase status
                    purchase.status = 'completed';
                    await purchase.save();
                }
                
                await userData.save();
            }
        } catch (processError) {
            console.error('Error processing pending purchases:', processError);
        }

        // Also check for completed purchases that might not be reflected in enrollments
        try {
            const completedPurchases = await Purchase.find({
                userId: userId,
                status: 'completed'
            });

            for (const purchase of completedPurchases) {
                const courseData = await Course.findById(purchase.courseId);
                if (courseData && !userData.enrolledCourses.includes(courseData._id)) {
                    // Add course to user's enrolled courses
                    userData.enrolledCourses.push(courseData._id);
                    // Add user to course's enrolled students
                    courseData.enrolledStudents.push(userData.supabaseId);
                    
                    await courseData.save();
                }
            }
            
            await userData.save();
        } catch (processError) {
            console.error('Error processing completed purchases:', processError);
        }

        // Get updated user data
        const updatedUserData = await User.findOne({ supabaseId: userId })

        // Get enrolled courses manually to avoid populate issues
        const enrolledCourses = await Course.find({
            _id: { $in: updatedUserData?.enrolledCourses || [] }
        }).select('courseTitle courseDescription courseThumbnail coursePrice discount courseContent educator playlistLink')

        res.json({success: true, enrolledCourses})

    } catch (error) {
        res.json({success: false, message:error.message})
    }
}

// Manual enrollment function for testing
export const manuallyEnrollUser = async (req, res) => {
    try {
        const { courseId } = req.body;
        const userId = req.user.id;
        

        
        const userData = await User.findOne({ supabaseId: userId });
        const courseData = await Course.findById(courseId);
        
        if (!userData || !courseData) {
            return res.json({ success: false, message: "User or course not found" });
        }
        
        // Check if already enrolled
        if (userData.enrolledCourses.includes(courseData._id)) {
            return res.json({ success: false, message: "User already enrolled in this course" });
        }
        
        // Add course to user's enrolled courses
        userData.enrolledCourses.push(courseData._id);
        await userData.save();
        
        // Add user to course's enrolled students
        courseData.enrolledStudents.push(userData.supabaseId);
        await courseData.save();
        
        res.json({ success: true, message: "User enrolled successfully" });
        
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Debug function to check user enrollment status
export const debugUserEnrollment = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const userData = await User.findOne({ supabaseId: userId });
        if (!userData) {
            return res.json({ success: false, message: "User not found" });
        }
        
        // Check all purchases for this user
        const allPurchases = await Purchase.find({ userId: userId });
        const pendingPurchases = await Purchase.find({ userId: userId, status: 'pending' });
        const completedPurchases = await Purchase.find({ userId: userId, status: 'completed' });
        
        // Get course details for enrolled courses
        const enrolledCourses = await Course.find({
            _id: { $in: userData.enrolledCourses }
        }).select('courseTitle courseDescription courseThumbnail coursePrice discount courseContent educator');
        
        const debugInfo = {
            userId: userId,
            userData: {
                _id: userData._id,
                email: userData.email,
                firstName: userData.firstName,
                lastName: userData.lastName,
                enrolledCourses: userData.enrolledCourses
            },
            purchases: {
                total: allPurchases.length,
                pending: pendingPurchases.length,
                completed: completedPurchases.length,
                details: allPurchases.map(p => ({
                    _id: p._id,
                    courseId: p.courseId,
                    status: p.status,
                    amount: p.amount,
                    createdAt: p.createdAt
                }))
            },
            enrolledCourses: enrolledCourses.map(c => ({
                _id: c._id,
                courseTitle: c.courseTitle,
                coursePrice: c.coursePrice
            }))
        };
        
        res.json({ success: true, debugInfo });
        
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Process pending purchases and enroll user
export const processPendingPurchases = async (req, res) => {
    try {
        const userId = req.user.id;

        // Find all pending purchases for this user
        const pendingPurchases = await Purchase.find({
            userId: userId,
            status: 'pending'
        });

        if (pendingPurchases.length === 0) {
            return res.json({ success: true, message: 'No pending purchases found' });
        }

        const userData = await User.findOne({ supabaseId: userId });
        if (!userData) {
            return res.json({ success: false, message: 'User not found' });
        }

        let processedCount = 0;

        for (const purchase of pendingPurchases) {
            try {
                const courseData = await Course.findById(purchase.courseId);
                if (!courseData) {
                    continue;
                }

                // Check if already enrolled
                if (userData.enrolledCourses.includes(courseData._id)) {
                    // Still update purchase status
                    purchase.status = 'completed';
                    await purchase.save();
                    processedCount++;
                    continue;
                }

                // Add user to enrolled students
                courseData.enrolledStudents.push(userData.supabaseId);
                await courseData.save();

                // Add course to user's enrolled courses
                userData.enrolledCourses.push(courseData._id);
                await userData.save();

                // Update purchase status
                purchase.status = 'completed';
                await purchase.save();

                processedCount++;

            } catch (error) {
                console.error('Error processing purchase:', purchase._id, error);
            }
        }

        res.json({ 
            success: true, 
            message: `Processed ${processedCount} pending purchases`,
            processedCount 
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};


// Purchase course

export const purchaseCourse = async (req,res) => {
    try {
        const {courseId} = req.body
        const {origin} = req.headers
        const userId = req.user.id; // Using Supabase user ID

        const userData = await User.findOne({ supabaseId: userId })

        const courseData = await Course.findById(courseId)
        if(!userData || !courseData)
        {
            res.json({success: false, message: "Data Not Found"})
        }

        const purchaseData = {
            courseId: courseData._id,
            userId: userData.supabaseId,
            amount: (courseData.coursePrice - courseData.discount * courseData.coursePrice / 100).toFixed(2),
        }

        const newPurchase = await Purchase.create(purchaseData);

        // stripe gateway initialize
        const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY)
        const currency = process.env.CURRENCY.toLowerCase();
        
        // creating line items to for stripe
        const line_items = [{
            price_data:{
                currency,
                product_data:{
                    name: courseData.courseTitle
                },
                unit_amount: Math.floor( newPurchase.amount ) * 100
            },
            quantity: 1
        }]

        const session = await stripeInstance.checkout.sessions.create({
            success_url: `${origin}/loading/my-enrollments`,
            cancel_url: `${origin}/`,
            line_items: line_items,
            mode: 'payment',
            metadata: {
                purchaseId: newPurchase._id.toString()
            }
        })

        res.json({success: true, session_url: session.url})


    } catch (error) {
        res.json({success: false, message:error.message})
    }
}

// Update user Course progress

export const updateUserCourseProgress = async(req,res)=>{
    try {
        const userId = req.user.id // Using Supabase user ID
        const {courseId, lectureId} = req.body
        
        // Get the MongoDB user ID
        const user = await User.findOne({ supabaseId: userId })
        if (!user) {
            return res.json({success: false, message: "User not found"})
        }
        
        const progressData = await CourseProgress.findOne({userId: user._id, courseId})

        if(progressData){
            if(progressData.lectureCompleted.includes(lectureId)){
                return res.json({success: true, message: "Lecture Already Completed"})
            }
            
            progressData.lectureCompleted.push(lectureId)
            progressData.completed = true
            await progressData.save()
        }
        else{
            await CourseProgress.create({
                userId: user._id,
                courseId,
                lectureCompleted: [lectureId]

            })
        }
        res.json({success:true, message: 'Progress Updated'})
    } catch (error) {
        res.json({success: false, message:error.message})
    }
}

// get user course progress

export const getUserCourseProgress = async(req,res)=>{
    try {
        const userId = req.user.id // Using Supabase user ID
        const {courseId} = req.body
        
        // Get the MongoDB user ID
        const user = await User.findOne({ supabaseId: userId })
        if (!user) {
            return res.json({success: false, message: "User not found"})
        }
        
        const progressData = await CourseProgress.findOne({userId: user._id, courseId})
        res.json({success: true, progressData: progressData || '0%'})
    } catch (error) {
        res.json({success: false, message:error.message})
    }
}


// Add user ratings to course

export const addUserRating = async (req,res)=>{
    try {
        const userId = req.user.id // Using Supabase user ID
        const {courseId, rating} = req.body
        
        // Get the MongoDB user ID
        const user = await User.findOne({ supabaseId: userId })
        if (!user) {
            return res.json({success: false, message: "User not found"})
        }
        

        

        if(!courseId || !user._id || !rating || rating < 1 || rating > 5)
        {
            res.json({success: false, message:"Invalid details"})
        }

        const course = await Course.findById(courseId)
        if(!course){
            return res.json({success: false, message:"Course Not found!"})
        }

        if(!user.enrolledCourses.includes(courseId)){
            return res.json({success: false, message:"User has not purchased this course."})
        }

        const existingRatingIndex = course.courseRatings.findIndex(r => r.userId.toString() === user._id.toString())
        if(existingRatingIndex > -1){
            course.courseRatings[existingRatingIndex].rating = rating;
        }
        else{
            course.courseRatings.push({userId: user._id, rating});
        }

        // await courseData.save()
        await course.save()
        res.json({success: true, message:"Rating Added"})

    } catch (error) {
        res.json({success: false, message: error.message});
    }
}