const express=require('express');
const userModel=require('../models/usermodel.js');
const protectRoute=require('../controller/authcontroller.js');




//* function to get the specific user from the mongodb database
module.exports.getUser= async function getUser(req,res){{
    let id=req.params.id;
    let user=await userModel.findById(id);
    if(user){
       return res.json({
            message:"user data",
            data:user//usrByName
        });
    }else{
       return res.json({
            message:"user not exit",
           
        }); 

    }
 
}}




//* function to update the user data in the mogodb database
module.exports.updateUser =async function updateUser(req,res){
    let id=req.params.id; 
    let dataToBeUpdated=req.body;
    let user= await userModel.findByIdAndUpdate(id, dataToBeUpdated,{new:true});
   /* //! it is used to update the data 
    for(key in dataToBeUpdated){
        users[key]=dataToBeUpdated[key];
    }*/
    res.json({
        message:"data updated successfully",
        data:user
    })
}

//* to delete the data from the mongodb database by passing specific email in the function
/*async function deleteUser(req,res){
    let user= await userModel.findOneAndDelete({email:"kumar@gmail.com"})
    res.json({
        message:"data deleted successfully",
        data:user
    })
}*/

//* function to delete the data from backend by using the request body instead of hard code email in function like above
module.exports.deleteUser =async function deleteUser(req, res) {
    let id=req.params.id;
    try {
        let user = await userModel.findOneAndDelete({_id: id});
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            message: "Data deleted successfully",
            data: user
        });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports.setCookies= function setCookies(req,res){
    //res.setHeader('set-cookie','isLoggedIn=true');
   res.cookie('isLoggedIn',false,{maxAge:1000*60*60*24,secure:true, httpOnly:true});
    res.send("cookies has been set");
}

module.exports.getCookies= function getCookies(req,res){
    let cookies=req.cookies.isLoggedIn;
    console.log(cookies);
    res.send('cookies recieved');

}

module.exports.getAllUser=async function getAllUser(req,res){
    let users= await userModel.find();
    if(users){
        res.json({
            message:"list of all users",
            data:users,
        })

    }
    
}

/*userRouter
.route('/:id')
.get(getUserById);*/
// query

/*app.get('/users',(req,res)=>{
    console.log(req.query);
    res.send(users);
})*/
