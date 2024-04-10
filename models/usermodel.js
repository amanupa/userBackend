const emailValidator= require('email-validator');
const bcrypt=require('bcrypt');
const crypto = require('crypto');
const mongoose=require('mongoose');




//* creating a variable to store the database link
const db_link="mongodb+srv://admin:TDyujcYKuJmHcQKV@cluster0.cful9cc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";


//* to connect to the mongodb server
mongoose.connect(db_link)
.then(function(db){
    console.log(db);
    console.log("userDataBase connected");
})
.catch(function(err){
    console.log(err);
});

const userSceema= mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate:function(){//* validator function to validation  
            return emailValidator.validate(this.email);//* here we are using the emailvalidator a third party librraries or we can also use the regix (regular expression for validating the mail)
        }
    },
    password:{
        type:String,
        required:true,
        min:8,
    },
    confirmPassword:{
        type:String,
        required:true,
        minLength:8,
        validate:function(){
            return this.confirmPassword==this.password;
        }
    },
    role:{
        type:String,
        enum:['admin','user','restaurentowner','deliveryBoy'],
        default:"user",
    },
    profile:{
        type:String,
        default:'img/users/default.jpeg',
    }
});

//Todo Hooks 
// ! here it does not matter the sequence of the pre and post hook the post hook will run after the all pre hooks completly run 
//! if we write the post hook above the pre hook (according to the top to bottom manner it  should run the post before the pre but no) first it will run all the pre hooks complitely then it will run the post hook
userSceema.pre('save',function(){//* it have two functionality 1. save and 2. remove (explore)
    console.log("before saving in db",this);// by using this we can access/see the data that going frontend to backend before saving in the database , here is version is not available in the data only id is available
})

userSceema.post('save',function(doc){
    console.log("after saving in db",doc);//by using the doc we can access the data that saved in the database with the version (__V:0)
})


//! Hook for dont save the confirm password in the database because it takes memory and we allready add the validator to check that the password and confirmpassword is same or not
userSceema.pre('save',function(){
    return this.confirmPassword=undefined;
})

//TODO Hashing 
// to hashed the password for security by using the third party libraries (bcrypt)
/*userSceema.pre('save',async function(){
    let salt=await bcrypt.genSalt();
    let hashedString=await bcrypt.hash(this.password,salt);
   // console.log(hashedString);
   this.password=hashedString;
});*/

// by using the node js built in crypto module to hash the password/anything without using third party library
userSceema.pre('save', async function() {
    const salt = crypto.randomBytes(8).toString('hex');//* 16 is the length to generate random bytes we can use any no. but a general use is factor of 8
    const hash = crypto.pbkdf2Sync(this.password, salt, 1000, 16, 'sha512').toString('hex');//* password based key derivation function it work synchonously
    //*1000 The number of iterations for the PBKDF2 algorithm. Increasing the number of iterations makes the hash more secure but also increases computational cost. 
    //* 64 The length of the output key in bytes. , sha512 is the hashing algorithm that used in cryptography
    this.password = hash;
});


//Todo userModel
//* to use that scheema we have to create the model 
const userModel=mongoose.model('userModel',userSceema);// by using the .model property of the mongeese we can create the model this property takes two parameter. 
module.exports=userModel;
// the first is the name of the model and second is the is to tell that by which we are creating this model or what is the base of the model that is the scheema.
// in simple language we can say that by which design we have to create the car/model