const express=require('express');
const userModel=require('../models/usermodel');
const jwt =require('jsonwebtoken');// importing the third party library jwt from npm package
const JWT_KEY='random_secret_key';// creating a variable for the secret key the strig is the random 

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
               res.cookie('login',token,{httpOnly:true});//before we are using the true or false keyword nut now we are using the jwt token(to store in the cookies)
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



//* protect route
module.exports.protectRoute=async function protectRoute(req,res,next){
    try{
        let token;
    if(req.cookies.login){// here we are using(dynamically) the cookie to check that the user is logged in or not instead of making a flag variable and set true and false
        console.log(req.cookies);// it will print the login data (jwt) the token will be seprated in three parts with the dot(.) first is the header ,second os the payload and third is the signature
           token=req.cookies.login;
        // here we are using the verify mathod of jwt to verify the new generated signature and the previously generated signature if both same then the user is same otherwise not
        let payload=jwt.verify(token,JWT_KEY);//req.cookies.login is the jwt which we get by the backend
        console.log("payload",payload);

        if(payload){
            const user=await userModel.findById(payload.payload);
            req.role=user.role;
            req.id=user.id;
           return next();

        }
       else{
           return res.json({
                message:"authentication failed",
            })
        }
        

    }else{
        //to check from where the request is coming browser or snapshot
        let client =req.get('User-Agent');
        if(client.includes("mozilla")==true){
            //herer if the user from the browser then i am redirection the user to the login page
            return res.redirect('/login');

        }
       return res.json({
            message:"Please login",
        })
    }

    }catch(err){
        return res.json({
            message:err.message,
        });
    }


};


//* authorization function to check the user role
module.exports.isAuthorised= function isAuthorised(role){
    return function(req,res,next){
        if(role.includes(req.role)==true){
           return next();
        }else{
            res.status(401).json({
                message:"only admin is allowed",
            })
        }

    }

}

//* forgot password

module.exports.forgotPassword=async function forgotPassword(req,res,next){
    let {email}=req.body;
    try{
        const user=await userModel.findOne({email:email});
        if(user){
            //read the docs part from mongoosejs.com/docs/guide.html(schemas)
            const resetToken=user.createResetToken();
            //creating the link for the reset password
            // http://abc.com/resetPassword/resetToken
            let resetPasswordLink= `${req.protocol}://${req.get('host')}/resetPassword/${resetToken}`;
            //send mail to the user using nodemailer

        }else{
            return res.status(401).json({
                message:"user not found",
                data:email
            })
        }


    }catch(err){
        res.status(500).json({
            message:err.message,
        })

    }
}

//* reset password

module.exports.resetPassword= async function resetPassword(req,res){
    try{
        const token=req.params.token;
    let {password, confirmPassword}=req.body;
    const user=await userModel.findOne({resetToken:token});
    if(user){
        //resetPasswordHandler will update the user password in db
        user.resetPasswordHandler(password,confirmPassword);
        await user.save();
        res.json({
            message:"user password updated successfully, please login agian",
        })
    }else{
        res.json({
            message:"user not found",
        })
    }

    }catch(err){
        res.json({
            message:err.message,
        })
    }
    
}

//* logout function 
//we can also redirect to the login page after successfully logout 
module.exports.logout=function logout(req,res){
    try{//here it is taking 4 arguements as a parameter 1.>existing cookie name , 2.> we are overriding the value of cookie login by a empty string, 3.> ther are many option available but here we are defining the max age which takes value in milisecond after that the cookie will be removed from the cookies section
        res.cookie('login',' ',{maxAge:1});
        res.json({
        message:"user logged out successfully",
    });

    }catch(err){
        res.json({
            message:err.message,
        });

    }
    

}