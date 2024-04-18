//!TODO: always make sure the sequence (execution will be done from top to bottom so write the function accordingly)
const express=require('express');
const {getUser,getAllUser,updateUser, deleteUser, updateProfileImage}=require('../controller/usercontroller');//getCookies,setCookies,
const {signup,login,isAuthorised,protectRoute,forgotPassword,resetPassword,logout} = require('../controller/authcontroller');
const app=express();
const multer=require('multer');
const path = require('path'); 
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

userRouter
.route('/forgotPassword')
.post(forgotPassword);

userRouter
.route('/resetPassword/:token')
.post(resetPassword);

userRouter
.route('/logout')
.get(logout);



// upload files by using multer (here we will upload the user prodile images)
const multerStorage=multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'public/images')
    },
    filename: function(req,file,cb){
        cb(null,`user-${Date.now()}.jpg`)
    }
});

const filter= function (req, file, cb){
    if(file.mimetype.startsWith("image")){
        cb(null,true)
    }else{
        cb(new Error("Not an image! please upload an image file"), false);
    }
}

const upload=multer({
    storage:multerStorage,
    fileFilter:filter
});

userRouter.post("/ProfileImage",upload.single("photo") ,updateProfileImage);

//*get request
userRouter.get('/ProfileImage',(req,res)=>{
    res.sendFile("/Users/aman0/Backend/projects/user/multer.html");

})

// upload files by using multer (here we will upload the user document pdf file)
const multerDocStorage=multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'public/users')
    },
    filename: function(req,file,cb){
        cb(null,`${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const docFilter= function (req, file, cb){
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed!'), false);
    }
}

const docUpload=multer({
    storage:multerDocStorage,
    fileFilter:docFilter
});

userRouter.post("/UserDocument",docUpload.single("pdfFile") ,updateProfileImage);

//*get request
userRouter.get('/UserDocument',(req,res)=>{
    res.sendFile("/Users/aman0/Backend/projects/user/docmulter.html");

})

//TODO: this section code is to upload multiple file at a same time like pdf and image 
/*const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Destination folder for storing uploaded files
    },
    filename: function (req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`); // Filename will be original filename with current timestamp
    }
});

// File filter function to accept only PDF and JPG files
const fileFilter = function (req, file, cb) {
    if (file.mimetype === 'application/pdf' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF and JPG files are allowed!'), false);
    }
};

// Multer upload configuration
const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

// POST route for uploading a PDF file and an image
app.post('/upload', upload.fields([{ name: 'pdfFile', maxCount: 1 }, { name: 'imageFile', maxCount: 1 }]), (req, res) => {
    res.send('Files uploaded successfully!');
}); */


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






module.exports=userRouter;