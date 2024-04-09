// the mogodb configuration and creating/storing the user in database (mongodb)

const express=require('express');
const app=express();
const mongoose=require('mongoose');
const cookieParser=require('cookie-parser');



//! act as middleware for post function , it is used when data is comming from the frontend to the server so it is used to convert the data in the form of json
app.use(express.json());//* it is used to convert the json data into the form of javascript objects, it is global middleware function

//app.use(express.urlencoded({extended: true}));

//* listioning the server on the port 3000
app.listen(3000);
app.use(cookieParser());


//* creating a variable of Router
const userRouter=require('./routers/userRouter');
//const authRouter=require('./routers/authRouter.js');

//*base route , router to use
app.use('/users',userRouter);
//app.use('/auth',authRouter);

