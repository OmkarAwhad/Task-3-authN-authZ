const express = require('express');
const router = express.Router();

const { signup , login } = require('../controllers/user.controllers');
const {authN, isStudent, isAdmin} = require('../middlewares/user.middlewares')

router.post('/signup',signup)
router.post('/login',login)


// protected routes 
router.get('/student', authN, isStudent, (req,res) => {
     res.json({
          success:true,
          msg:"Welcome to protected route for students"
     })
})
router.get('/admin', authN, isAdmin, (req,res) => {
     res.json({
          success:true,
          msg:"Welcome to protected route for admin"
     })
})

module.exports = router;