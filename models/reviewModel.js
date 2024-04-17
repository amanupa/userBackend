
const mongoose=require('mongoose');
const userModel=require('./usermodel');
const usersPlanModel=require('./planmodel');


//* creating a variable to store the database link
const db_link="your_db_link";

//* to connect to the mongodb server
mongoose.connect(db_link)
.then(function(db){
    console.log(db);
    console.log("review db connected");
})
.catch(function(err){
    console.log(err);
});

//* userSceema 
const reviewSceema= mongoose.Schema({
    review:{
        type:String,
        required:[true,"review is required"]
    },
    
    ratings:{
        type:Number,
        min:1,
        max:10,
        required:[true,"rating is required"]
    },
    createdAt:{
        type:Date,
        default:Date.now()
        
    },
    user:{//by this we are creating link b/w the reviewmodel and plan model
        type:mongoose.Schema.ObjectId,// the type of this object is id because we are taking the user id who is giving the review
        ref:'userModel',// reffrence means user belong to where which model the path
        required:[true,'review must be belong to a user']
    },
    plan:{// same as user 
        type:mongoose.Schema.ObjectId,
        ref:'usersPlanModel',
        required:[true,'review must be belong to a plan']
    },

   
});

// this is pre hook function where we are giving two params the first one is /^find/ means run this hook when any queries related to find will be hit or perform by the user 
// and populate means fill the given entity like here we are giving the user of the reviewmodel and asking for the name and profile of the usermodel (the path which we provided in the review plan user object)
// same for the plan but in plan we are taking all the value of usersPlanModel key in our reviewModel plan object 
// and then running the next() function to move forward
// this.populate means in the current model we are populating these given things
reviewSceema.pre(/^find/,function(next){
    this.populate({
        path:"user",
        select:"name profile"
    }).populate("plan");
    next();
})




const reviewModel=mongoose.model('reviewModel',reviewSceema);// by using the .model property of the mongeese we can create the model this property takes two parameter. 

module.exports=reviewModel;