const User = require('../models/user.models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config();
const {ApiError} = require('../utils/ApiError')
const {ApiResponse} = require('../utils/ApiResponse')

exports.signup = async(req,res) => {
     try {
          const {name,email,password,role} = req.body;

          // checking if user already exists
          const userExits = await User.findOne({email})
          if(userExits){
               return res.status(400).json({
                    success:false,
                    msg:"User already exits"
               })
          }

          // secure password
          let hashedPassword;
          try {
               hashedPassword = await bcrypt.hash(password,10)
          } catch (error) {
               return res.status(400).json({
                    success:false,
                    msg:"Not able to hash password"
               })
          }

          // create user
          const user = await User.create(
               {
                    name,email,password:hashedPassword,role
               }
          )

          return res.status(300).json({
               success:true,
               msg:"User created successfully"
          })

     } catch (error) {
          console.log("Error in user creation")
          return res.status(500).json({
               success:false,
               msg:"Error in user creation"
          })
     }
}

exports.login = async(req,res) =>{
     try {
          const {email, password} = req.body;

          // fields are empty or not
          if (!email || !password) {
               return res.status(401).json({
                    success:false,
                    msg:"empty field"
               })
          }

          // user exists or not
          let userExists = await User.findOne({email})
          if(!userExists){
               return res.status(400).json({
                    success:false,
                    msg:"User does not exists"
               })
          }

          const payload = {
               id : userExists._id,
               email : userExists.email,
               role:userExists.role,
          }

          // validate password n generate jwt
          if(await bcrypt.compare(password, userExists.password)){
               // password matched
               let token = jwt.sign(
                    payload , 
                    process.env.JWT_SECRET , 
                    {
                         expiresIn:"2h",
                    }
               )
               
               // new token field banake usme humne banaya hua token paas kar diya 
               // aur password dikhe na , isiliye usse hata do
               userExists = userExists.toObject();
               userExists.token = token;
               userExists.password = undefined

               const options = {
                    expires: new Date(Date.now() + 3*24*60*60*1000),
                    httpOnly:true,
               }
               res.cookie("tokenCookie",token, options).status(300).json({
                    success:true,
                    token,
                    userExists,
                    msg:"User logged in successfully"
               });

          }else{
               // password do not match
               return res.status(400).json({
                    success:false,
                    msg:"Incorrect password"
               })
          }
     } catch (error) {
          console.log("Error in logging in")
          return res.status(500).json({
               success:false,
               msg:"Error in logging in"
          })
     }
}
