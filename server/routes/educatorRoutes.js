import express from 'express'

import { addCourse, educatorDashboardData, getEducatorCourses, getEnrolledStudentsData, updateRoleToEducator } from '../controllers/educatorController.js'
import { supabaseAuthMiddleware } from '../middlewares/supabaseAuth.js';
import { protectEducator } from '../middlewares/authMiddleware.js';
import upload from '../configs/multer.js';

const educatorRouter = express.Router()

// add educator role
educatorRouter.get('/update-role', supabaseAuthMiddleware, updateRoleToEducator);
educatorRouter.post('/add-course', supabaseAuthMiddleware, upload.single('image'), protectEducator, addCourse);
educatorRouter.get('/courses', supabaseAuthMiddleware, protectEducator, getEducatorCourses);
educatorRouter.get('/dashboard', supabaseAuthMiddleware, protectEducator, educatorDashboardData);
educatorRouter.get('/enrolled-students', supabaseAuthMiddleware, protectEducator, getEnrolledStudentsData);


export default educatorRouter;