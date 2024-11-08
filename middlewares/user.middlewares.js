const jwt = require('jsonwebtoken')
require('dotenv').config();

exports.authN = (req,res,next) => {
     try {
          const token = req.body.token;

          if(!token){
               return res.status(401).json({
                    success:false,
                    msg:"Token Missing"
               })
          }

          // verify token
          try {
               const payload = jwt.verify(token, process.env.JWT_SECRET);
               console.log(payload)

               req.userExists = payload;
          } catch (error) {
               return res.status(401).json({
                    success:false,
                    msg:"Invalid Token"
               })
          }
          next();
     } catch (error) {
          return res.status(400).json({
               success:false,
               msg:"Something went wrong, while verifying token "
          })
     }
}

exports.isStudent = (req,res,next) => {
     try {
          if(req.userExists.role !== "Student"){
               return res.status(400).json({
                    success:false,
                    msg:"This is a protected route for students"
               })
          }
          next();
     } catch (error) {
          return res.status(400).json({
               success:false,
               msg:"User role not matching"
          })
     }
}

exports.isAdmin = (req,res,next) => {
     try {
          if(req.userExists.role !== "Admin"){
               return res.status(400).json({
                    success:false,
                    msg:"This is a protected route for Admins"
               })
          }
          next();
     } catch (error) {
          return res.status(400).json({
               success:false,
               msg:"User role not matching"
          })
     }
}