const express=require('express');
const reviewModel=require('../models/reviewModel');
const usersPlanModel=require('../models/planmodel');

module.exports.getAllReviews=async function getAllReviews(req,res){
    try{
        let allReviews= await reviewModel.find();
        if(allReviews){
           return res.json({
                message:"list of reviews",
                data:allReviews,
            });
        }else{
            return res.json({
                message:"no reviews available",
            })
        }
    }catch(err){
        res.json({
            message:err.message,
        })

    }
}


module.exports.top3Reviews=async function top3Reviews(req,res){
    try{
        let reviews= await reviewModel.find().sort({
            ratings:-1
        }).limit(3);
        if(reviews){
           return res.json({
                message:"list of reviews",
                data:reviews,
            });
        }else{
            return res.json({
                message:"no reviews available",
            })
        }
    }catch(err){
        res.json({
            message:err.message,
        })

    }
}


module.exports.getPlanReviews=async function getPlanReviews(req,res){
    try{
        let planid=req.params.id;
        let reviews= await reviewModel.find();
        reviews=reviews.filter(review => review.plan._id==planid);
        if(reviews){
           return res.json({
                message:"list of reviews",
                data:reviews,
            });
        }else{
            return res.json({
                message:"no reviews available",
            })
        }
    }catch(err){
        res.json({
            message:err.message,
        })

    }
}


module.exports.postReview=async function postReview(req,res){
    try{
        let id=req.params.plan;
        let plan=await usersPlanModel.findById(id);
        let reviewData =req.body;
        let createdReviews= await reviewModel.create(reviewData);
        plan.ratingsAverage=((plan.ratingsAverage + req.body.ratings)/2);
        await plan.save();
        if(createdReviews){
           return res.json({
                message:"Review Created",
                data:createdReviews,
            });
        }else{
            return res.json({
                message:"Review not created",
            })
        }
    }catch(err){
        res.status(404).json({
            message:err.message,
        })

    }
}


module.exports.updateReview=async function updateReview(req,res){
    try{
        let planid=req.params.id;
        let id=req.body.id;
        let dataToBeUpdated =req.body;
        let updatedReview= await reviewModel.findByIdAndUpdate(id,dataToBeUpdated,{new:true});
        if(updatedReview){
           return res.json({
                message:"Review Updated",
                data:updatedReview,
            });
        }else{
            return res.json({
                message:"Review not update",
            })
        }
    }catch(err){
        res.json({
            message:err.message,
        })

    }
}

module.exports.deleteReview=async function deleteReview(req,res){
    try{
        let planid=req.params.id;
        let id=req.body.id;
        let deletedReview= await reviewModel.findByIdAndDelete(id);
        if(deletedReview){
           return res.json({
                message:"Review deleted successfully",
                data:deletedReview,
            });
        }else{
            return res.json({
                message:"Review not deleted",
            })
        }
    }catch(err){
        res.status(404).json({
            message:"operation not executed successfully",
        })

    }
}