// the mogodb configuration and creating/storing the user in database (mongodb)

const express=require('express');
const app=express();
const mongoose=require('mongoose');
const cookieParser=require('cookie-parser');




//! act as middleware for post function , it is used when data is comming from the frontend to the server so it is used to convert the data in the form of json
app.use(express.json());//* it is used to convert the json data into the form of javascript objects, it is global middleware function

//app.use(express.urlencoded({extended: true}));

//* listioning the server on the port 3000
app.listen(4000,()=>{
    console.log('listioning on port 4000');
});
app.use(cookieParser());


//* creating a variable of Router
const userRouter=require('./routers/userRouter');
//const authRouter=require('./routers/authRouter.js');
const planRouter=require('./routers/planRouter');
const reviewRouter=require('./routers/reviewRouter');
//*base route , router to use
app.use('/user',userRouter);
app.use('/plans',planRouter);
app.use('/review',reviewRouter);
//app.use('/auth',authRouter);

//const usersPlanModel=require('./models/planmodel');

