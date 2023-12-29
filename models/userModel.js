import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: { type: String, unique: true },
    password: String,
    name: String,
    phone: String,
    profileImage: String,
    role: { type: String, enum: ['Admin', 'User'], default: 'User' },
},
    { timestamps: true });

export default mongoose.model('User', userSchema)
