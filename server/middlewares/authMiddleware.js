import { clerkClient } from "@clerk/express";

// Middleware (protect educator route)

export const protectEducator = async(req,res, next) => {
    try {
        const userId = req.auth.userId
        const response = await clerkClient.users.getUser(userId)

        if(response.publicMetadata.role !== 'educator'){
            res.json({success: false, message:"Unauthorized Access!"})
        }
        next()

    } catch (error) {
        res.json({success: false, message:error.message})
    }
}