const express=require('express');
const reviewRouter=express.Router();
const { protectRoute, isAuthorised, } = require('../controller/authcontroller');
const {getAllReviews,top3Reviews,getPlanReviews,postReview,updateReview,deleteReview}=require('../controller/reviewController');

reviewRouter
.route('/all')
.get(getAllReviews);

reviewRouter
.route('/top3')
.get(top3Reviews);

reviewRouter
.route('/:id')
.get(getPlanReviews);


// these operations can only done by the use so user should be logged in
reviewRouter.use(protectRoute);
reviewRouter
.route('/createReview/:plan')
.post(postReview);

reviewRouter
.route('/updateReview/:plan')
.patch(updateReview);

reviewRouter
.route('/deleteReview/:plan')
.delete(deleteReview);



module.exports=reviewRouter;