const bytes = require('bytes');
const userModel=require('../models/users');
const bcrypt= require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const AppError = require('../utils/AppError');
const { CatchAsync } = require("../utils/CatchAsync"); 


dotenv.config();

const saveUser= CatchAsync(async(req,res,next)=>{
    const user= req.body;

    const newUser= await userModel.create(user);
        res.status(200).json({
                status:"Success",                data:newUser
            })

}) 

const getAll = CatchAsync(async(req,res,next)=>{ 
       let users = await userModel.find().select('-password') ;
       res.status(200).json({
           status:"Success",
           data:users
       })   
 }) 


 const getOne = CatchAsync(async(req,res,next)=>{ 
    const {id} = req.params;  
    let user = await userModel.findById(id).select('-password') ;
    res.status(200).json({
        status:"Success",
        data:user
    })   
}) 


  const update= CatchAsync(async(req,res,next)=>{
    const {id} = req.params;  
    const body = req.body; 
    let user;      

      user = await userModel.findByIdAndUpdate(id,{username:body.username},{new:true});

      if(user){
         res.status(200).json({
             status:"user was edited successfully",
              data:user
          })
      }else{
          next(new AppError(400,"user not found"))
      }
 
 }) 


 const remove= CatchAsync(async(req,res,next)=>{
    const {id} = req.params;  
        let user = await userModel.findByIdAndDelete(id);

        if(user){
           res.status(200).json({
               status:"success"
            })
        }else{
            next(new AppError(400,"user not found"))
        }
      
 } ) 

 const login=  async(req,res,next)=>{

    const {email,password} = req.body;   
    if(!email||!password){
        return next(new AppError(422,"You must provide email and password."))
    }

    let user= await userModel.findOne({email});
    if(!user){
        return next(new AppError(401,"Invalid email."))
    }

    let isValid = await bcrypt.compare(password,user.password);
    if(!isValid){
        return next(new AppError(401,"Invalid password."))
    }

    let token = jwt.sign({id:user._id,email:user.email,role:user.role},process.env.SECRET,{expiresIn:'1h'});
    res.status(200).json({
        status:"User logged in successfully",
         token:token
     })
 }



module.exports={saveUser,login,getAll,update,remove,getOne}