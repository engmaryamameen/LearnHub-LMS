import express from "express";
import { 
    addUserRating, 
    getUserCourseProgress, 
    getUserData, 
    purchaseCourse, 
    updateUserCourseProgress, 
    userEnrolledCourses,
    registerUser,
    getUserProfile,
    updateUserProfile,
    verifyUserEmail,
    getAllUsers,
    processPendingPurchases,
    manuallyEnrollUser,
    debugUserEnrollment
} from "../controllers/userController.js";
import { supabaseAuthMiddleware } from '../middlewares/supabaseAuth.js';

const userRouter = express.Router();

// Authentication routes (no auth required)
userRouter.post('/register', registerUser);
userRouter.get('/profile/:supabaseId', getUserProfile);
userRouter.put('/profile/:supabaseId', updateUserProfile);
userRouter.post('/verify-email/:supabaseId', verifyUserEmail);
userRouter.get('/all', getAllUsers);

// Protected routes (auth required)
userRouter.get('/data', supabaseAuthMiddleware, getUserData);
userRouter.get('/enrolled-courses', supabaseAuthMiddleware, userEnrolledCourses);
userRouter.post('/purchase', supabaseAuthMiddleware, purchaseCourse);
userRouter.post('/process-pending-purchases', supabaseAuthMiddleware, processPendingPurchases);
userRouter.post('/update-course-progress', supabaseAuthMiddleware, updateUserCourseProgress);
userRouter.post('/get-course-progress', supabaseAuthMiddleware, getUserCourseProgress);
userRouter.post('/add-rating', supabaseAuthMiddleware, addUserRating);
userRouter.post('/manual-enroll', supabaseAuthMiddleware, manuallyEnrollUser);
userRouter.get('/debug-enrollment', supabaseAuthMiddleware, debugUserEnrollment);

export default userRouter;