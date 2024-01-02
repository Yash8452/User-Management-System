import userModel from '../models/userModel.js';
import dotenv from 'dotenv';
import fs from "fs";
import JWT from 'jsonwebtoken'
import  {comparePassword, hashPassword}  from '../helpers/authHelper.js';
dotenv.config();

// ========REGISTER-CONTROLLER========================================
export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone } = req.fields;
    const { photo } = req.files;
    //Validations---------



    //---------------------
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.status(201).send({
        success: false,
        message: "Email already registered. Please login.",
      });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = new userModel({...req.fields, password: hashedPassword});

    if (photo) {
        newUser.photo.data = fs.readFileSync(photo.path);
        newUser.photo.contentType = photo.type;
      }
      await newUser.save();

    res.status(201).send({
      success: true,
      message: "Registered Successfully",
      user: newUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error in Registration",
      error: error.message,
    });
  }
};

// ========LOGIN-CONTROLLER========================================
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }
    //check user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registerd",
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(404).send({
        success: false,
        message: "Invalid Password",
      });
    }
    //token
    console.log(process.env.JWT_SECRET_KEY)
    const token =  JWT.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "login successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login controller",
      error,
    });
  }
};


// ========UPDATE-USER-PROFILE========================================
export const updateUserController = async (req, res) => {
  try {
    const { name } = req.fields;
    const { photo } = req.files;

    const userId = req.user._id; // extract user ID from authentication 
    
    // Fetch the user from the database
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    // Allowing users to update their name
    if (name) {
      user.name = name;
    }

    // Allowing users to update their profile image
    if (photo) {
      user.photo = photo;
    }

    // Save the updated user details
    const updatedUser = await user.save();

    res.status(200).send({
      success: true,
      message: "Profile updated successfully",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        photo: updatedUser.photo,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error updating profile",
      error,
    });
  }
  
};

// ========DELETE-USER-========================================
export const deleteUserController = async (req, res) => {
  try {
    //getting userID from middleware
    const userId = req.user._id;     
    // Find the user by ID and delete
    const deletedUser = await userModel.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Account deleted successfully",
      user: {
        _id: deletedUser._id,
        name: deletedUser.name,
        email: deletedUser.email,
        phone: deletedUser.phone,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Errorin deleting account",
      error,
    });
  }
};

//=========ADMIN REGISTERATION===========================================
export const registerAdminController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if an admin exists
    const existingAdmin = await userModel.findOne({ email });

    if (existingAdmin) {
      return res.status(400).send({
        success: false,
        message: "Admin with this email already exists",
      });
    }
    const hashedPassword = await hashPassword(password);

    // Create a new admin
    const newAdmin = new userModel({
      name,
      email,
      password: hashedPassword,
      role:"Admin", //
    });

    // Save the new admin to the database
    await newAdmin.save();

    res.status(201).send({
      success: true,
      message: "Admin account created successfully",
      admin: {
        _id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error registering admin account",
      error,
    });
  }
};

//=========GET ALL USERS=================================================
export const getAllUsersController = async (req, res) => {
  try {
    const users = await userModel.find({ role: 'User' },'-photo'); //find by role=user & exclude photo

    res.status(200).send({
      success: true,
      message: "List of all users",
      users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error fetching users",
      error,
    });
  }
};


//========UPDATE A USER PROFILE BY ID=================================
export const updateUserControllerById = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { name } = req.body;
    const{photo} = req.fields;
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    // Update user details if provided
    if (name) {
      user.name = name;
    }
    if (photo) {
      user.photo = photo;
    }

    const updatedUser = await user.save();

    res.status(200).send({
      success: true,
      message: "User details updated successfully",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        profileImage: updatedUser.profileImage,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error updating user details",
      error,
    });
  }
};

//========DELETE A USER  BY ID============================================
export const deleteUserControllerById = async (req, res) => {
  try {
    const userId = req.params.userId;

    const deletedUser = await userModel.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "User deleted successfully",
      user: {
        _id: deletedUser._id,
        name: deletedUser.name,
        email: deletedUser.email,
        phone: deletedUser.phone,
        // Include other user details if needed
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error deleting user",
      error,
    });
  }
};
