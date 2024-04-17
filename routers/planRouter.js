const express=require('express');
const { protectRoute, isAuthorised, } = require('../controller/authcontroller');
const {getAllPlans,getPlan,createPlan,updatePlan,deletePlan, top3Plans} = require('../controller/planController');

const planRouter=express.Router();

//all plans 
planRouter
.route('/allPlans')
.get(getAllPlans);

planRouter
.route('/top3Plans')
.get(top3Plans);

// own plan (login user);
planRouter.use(protectRoute);
planRouter
.route('/plan/:id')
.get(getPlan);

// create, delete and update plan by authorised person
// only authorised persons can perform these actions
planRouter.use(isAuthorised(["admin","restaurentowner"]));

planRouter
.route('/createPlan')
.post(createPlan);

planRouter
.route('/updatePlan/:id')
.patch(updatePlan)

planRouter
.route('/deletePlan/:id')
.delete(deletePlan);

module.exports=planRouter;