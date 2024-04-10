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

// user profile
//userRouter.use(protectRoute);
userRouter
.route('/userProfile/:id')
.get(getUser)

// admin specific function
//userRouter.use(isAuthorised(['admin']));
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
userRouter
.route('/signup')
.post(signup);

userRouter
.route('/login')
.post(login);






module.exports=userRouter;