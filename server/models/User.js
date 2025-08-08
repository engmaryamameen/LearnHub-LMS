import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        supabaseId: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        role: { 
            type: String, 
            enum: ['student', 'educator', 'admin'], 
            default: 'student' 
        },
        phone: { type: String },
        isVerified: { type: Boolean, default: false },
        imageUrl: { type: String },
        enrolledCourses: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Course'
            }
        ],
        // For educators
        createdCourses: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Course'
            }
        ],
        // Profile fields
        bio: { type: String },
        location: { type: String },
        website: { type: String },
        socialLinks: {
            twitter: { type: String },
            linkedin: { type: String },
            github: { type: String }
        }
    }, 
    { timestamps: true }
);

const User = mongoose.model('User', userSchema)

export default User;