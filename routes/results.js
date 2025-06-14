 const express = require("express");
 const router=express.Router();
 const { getAllResults,getStudentResults } = require('../controllers/results');
 const {auth,restrictTo} = require('../middlewares/auth') ;

 router.get("/",auth,restrictTo('admin'),getAllResults);

 router.get("/stu",auth,restrictTo('student'),getStudentResults);
 
 module.exports= router;