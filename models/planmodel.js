
const crypto = require('crypto');
const { validate } = require('email-validator');
const mongoose=require('mongoose');
const { type } = require('os');

//* creating a variable to store the database link
const db_link="your_db_link";

//* to connect to the mongodb server
mongoose.connect(db_link)
.then(function(db){
    console.log(db);
    console.log("plan db connected");
})
.catch(function(err){
    console.log(err);
});

//* userSceema 
const usersPlanSceema= mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        maxlength:[20,'plan name should be not exceed more than 20 characters']//by this we can create our custom error message ,first one no. 20 is here the value after which the error will be encountered and the second string is the error message 
    },
    duration:{
        type:Number,
        required:true
    },
    price:{
        type:Number,
        required:[true,"price not entered"]
    },
    ratingsAverage:{
        type:Number
    },
    discount:{
        type:Number,
        validate:[function(){
            return this.discount<100
        },"discount should not exceed price"]
    }
   
});





const usersPlanModel=mongoose.model('usersPlanModel',usersPlanSceema);// by using the .model property of the mongeese we can create the model this property takes two parameter. 


// manually saving the data/plan in the database
/*(async function createPlan(){
    let planObj={
        name:"Burger",
        duration:30,
        price:100,
        ratingsAverage:4.3,
        discount:10
    }
    // by this also we can save the data in the database
    //let data= await usersPlanModel.create(planObj);
    //console.log('data saved',data);

    // here we are saving the data in the database
    const doc=new usersPlanModel(planObj);
    await doc.save();
    console.log('doc saved',doc);
})();*/

module.exports=usersPlanModel;