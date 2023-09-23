const jwt = require('jsonwebtoken');
const User= require('../models/UserModel')
const dotenv= require('dotenv');
dotenv.config();

const authenticateUser=async (req,res,next)=>{
    const token = req.header('Authorization');
     console.log(token,"=-----")
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
      const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
      console.log("decodedtoken",decodedToken);
      const user = await User.findById(decodedToken.userId);
  console.log("user",user)
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }
  
      req.user = user;
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
}

module.exports= authenticateUser;