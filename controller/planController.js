const usersPlanModel=require('../models/planmodel')
const express=require('express');
module.exports.getAllPlans=async function getAllPlans(req,res){
    try{
        let allPlans=await usersPlanModel.find();
        if(allPlans){
            return res.json({
                message:"list of plans",
                data:allPlans
            })
        }else{
            return res.json({
                message:"no plans"
            })
        }

    }catch(err){
        res.status(500).json({
            message:err.message,
        })
    }
    

}

module.exports.getPlan=async function getPlan(req,res){
    try{
        let id=req.params.id;
        let userPlan=await usersPlanModel.findById(id);
        if(userPlan){
            return res.json({
                message:"user plan",
                data:userPlan
            })
        }else{
            return res.json({
                message:"no plans"
            })
        }

    }catch(err){
        res.status(500).json({
            message:err.message,
        })
    }
    

}

// top 3 plans 
module.exports.top3Plans=async function top3Plans(req,res){
    try{
        const plans=await usersPlanModel.find().sort({
            ratingsAverage:-1
        }).limit(3);
        if(plans){
            return res.json({
                message:"top 3 plans",
                data:plans
            })
        }else{
            res.json({
                message:"no plans"
            })
        }
    }catch(err){
        res.json({
            message:err.message
        })

    }

}

module.exports.createPlan=async function createPlan(req,res){
    try{
        let planData=req.body;
        let createdPlan= await usersPlanModel.create(planData);
        if(createdPlan){
            return res.status(200).json({
                message:"plan created successfully",
                data:createdPlan
            });
        }else{
            return res.json({
                message:"plan not created"
            })
        }
    }catch(err){
        res.status(500).json({
            message:err.message,
        })

    }
}

module.exports.deletePlan=async function deletePlan(req,res){
    try{
        let id=req.params.id;
        let deletedPlan= await usersPlanModel.findByIdAndDelete({id:id});
        if(deletedPlan){
            return res.status(200).json({
                message:"plan deleted successfully",
                data:deletedPlan
            });
        }else{
            return res.json({
                message:"plan not found"
            })
        }
    }catch(err){
        res.status(500).json({
            message:err.message,
        })

    }
}


module.exports.updatePlan=async function updatePlan(req,res){
    try{
        let id=req.params.id;
        let dataToBeUpdate=req.body;
        //we can also update the data by this (using this in usermodel)
        let updatedPlan= await usersPlanModel.findByIdAndUpdate(id, dataToBeUpdate,{new:true});
       /*// second method by which we can update the data
       let keys=[];// kes array to store the data which we want to update
       for(let key in data){
        keys.push(key);
       }
       let plan=await usersPlanModel.findById(id);
       for(let key in keys){
        plan[key]=dataToBeUpdate[key];
       }
       await plan.save();*/
       res.json({
        message:"plan updated successfully",
        data:updatedPlan,
       })

        
    }catch(err){
        res.status(500).json({
            message:err.message,
        })

    }
}

