const express=require('express');
const userModel=require('../models/usermodel');
const jwt =require('jsonwebtoken');// importing the third party library jwt from npm package
const JWT_KEY='aman6777secretkey01';// creating a variable for the secret key the strig is the random 

/*module.exports.middleware = function middleware(req,res,next){//the middleware function 
    console.log("middleware encountered");
    next();
}*/

//* function to loogin the user
module.exports.login = async function login(req,res){
    try{
    let data=req.body;
    if(data.email){
        let user=await userModel.findOne({email:data.email});
        if(user){
            if(user.password==data.password){
               // res.cookie('isLoggedIn',true,{httpOnly:true});// here we are seeting the cookie to set if user is logged in or not 
               let uid=user['_id']; //uid (it is the payload)
               let token=jwt.sign({payload:uid},JWT_KEY);//creating the jwt (in this function it is taking three parameters first one is payload, second one is the secret key and third one is the algorithm but if we are not providing any algorithm then by default it take the HS256 hashing algorithm to generate the token(hash value))
               res.cookie('login',token,);//before we are using the true or false keyword nut now we are using the jwt token(to store in the cookies)
               return res.json({//{httpOnly:true}
                    message:"user logged in successfully",
                    userDetails:data,
                })
    
            }else{
                return res.json({
                    message:"password is not correct",
                })
            }
    
        }else{
            res.json({
                message:"user not found",
            })
        }

    }else{
        return res.status(500).json({
            message:"email is  not valid",
        })
    }

}catch(e){
    return res.status(500).json({
        message:e.message,
    })
}

}


//* to create new user/(store the data in the database of the new user ) 
module.exports.signup= async function signup(req,res){
    try{
    let dataObj=req.body;
    let user=await userModel.create(dataObj);
    console.log('backend',user);
    if(user){
        return res.json({
            message:"user signed up",
            data:user,
        })

    }else{
        res.json({
            message:"something wrong happned",
            data:user,
        })

    }
    console.log('backend',user);

    res.json({
        message:"user signed up",
        data:user
    })

    }catch(err){
        res.json({
            message:"user not signed up",
        })
    }
    
}
//TODO: after successfully creatin/storing the data in the mongodb the mongo will automatically assign the unique id to the object and when we will console the data we can see that this unique id.
/*
//* authorization function to check the user role
module.exports.isAuthorised= function isAuthorised(role){
    return function(req,res,next){
        if(role.include(req.role)==true){
           return next();
        }else{
            response.status(401).json({
                message:"only admin is allowed",
            })
        }

    }

}*/
/*
//* protect route
module.exports.protectRoute=async function protectRoute(req,res,next){
    try{
        let token;
    if(req.cookies.login){// here we are using(dynamically) the cookie to check that the user is logged in or not instead of making a flag variable and set true and false
        console.log(req.cookies);// it will print the login data (jwt) the token will be seprated in three parts with the dot(.) first is the header ,second os the payload and third is the signature
           token=req.cookies.login;
        // here we are using the verify mathod of jwt to verify the new generated signature and the previously generated signature if both same then the user is same otherwise not
        let payload=jwt.verify(token,JWT_KEY);//req.cookies.login is the jwt which we get by the backend

        if(payload){
            const user=await userModel.findbyId(payload.payload);
            req.role=user.role;
            req.id=user.id;
           return next();

        }
       else{
           return res.json({
                message:"authentication failed",
            })
        }
        

    }

    }catch(err){
        return res.json({
            message:err.message,
        });
    }


};
*/