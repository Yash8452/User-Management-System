import express from "express";
import  { deleteUserController, deleteUserControllerById, getAllUsersController, loginController, registerAdminController, registerController, updateUserController, updateUserControllerById } from "../controllers/authController.js";
import formidable from "express-formidable"; //input from forms
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

//router object
const router = express.Router();

//routing

//REGISTER 
router.post("/register",formidable() , registerController);
// Admin Registeration
router.post('/admin/register', registerAdminController);
//LOGIN
router.post("/login", loginController);

//Protected Routes

//USER====================>
router.get("/user-auth", requireSignIn, (req, res) => {
    res.status(200).send({ ok: true });
  });

//update user profile
router.put("/profile", requireSignIn, formidable(), updateUserController);

//delete user account
router.delete('/delete',requireSignIn, deleteUserController);


//ADMIN===================>
  router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
    res.status(200).send({ ok: true });
  });

//view all users
router.get('/users',requireSignIn,isAdmin, getAllUsersController);
//update user by Id
router.put('/users/update/:userId',requireSignIn,isAdmin,  updateUserControllerById);
//delete a user by Id
router.delete('users/delete/:userId',requireSignIn,isAdmin,deleteUserControllerById)





export default router;