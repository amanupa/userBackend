//!TODO: always make sure the sequence (execution will be done from top to bottom so write the function accordingly)
const express=require('express');
const {getUser,getAllUser,updateUser, deleteUser,}=require('../controller/usercontroller');//getCookies,setCookies,
const {signup,login,isAuthorised,protectRoute} = require('../controller/authcontroller');
const app=express();
//* creating a variable of Router
const userRouter=express.Router();

// users options
userRouter
.route('/updateUser/:id')
.patch(updateUser);
userRouter
.route('/deleteUser/:id')
.delete(deleteUser);

userRouter
.route('/signup')
.post(signup);

userRouter
.route('/login')
.post(login);


// user profile
userRouter.use(protectRoute);
userRouter
.route('/userProfile/:id')
.get(getUser)

// admin specific function
userRouter.use(isAuthorised(['admin']));
userRouter
.route('/')
.get(getAllUser);
/*
// cookies
userRouter
.route("/getCookies")
.get(getCookies);

userRouter
.route("/setCookies")
.get(setCookies);
*/






module.exports=userRouter;