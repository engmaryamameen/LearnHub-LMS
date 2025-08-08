import { supabase } from '../configs/supabase.js'

// Middleware (protect educator route)
export const protectEducator = async(req,res, next) => {
    try {
        const userId = req.user.id // Using Supabase user ID
        
        // Get user from our database
        const User = (await import('../models/User.js')).default
        const user = await User.findOne({ supabaseId: userId })

        if (!user || user.role !== 'educator') {
            return res.json({success: false, message:"Unauthorized Access!"})
        }
        
        next()

    } catch (error) {
        res.json({success: false, message:error.message})
    }
}