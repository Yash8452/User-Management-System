import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: { 
        type: String, 
        unique: true 
    
    },
    password: {
        type : String
    },
    name:  {
        type : String,
    },
    phone: {
        type : String, 
    },
    photo: {
        data: Buffer,
        contentType: String,
      },
    role: { 
        type: String, 
        enum: ['Admin', 'User'], 
        default: 'User' 
    },
},
    { timestamps: true });

export default mongoose.model('User', userSchema)
