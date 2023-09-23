const bcrypt = require('bcrypt')
const User = require('../models/UserModel');
const Leave= require('../models/LeaveModel')
const jwt = require('jsonwebtoken')
const dotenv= require('dotenv');
dotenv.config();

const createUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            password: hashedPassword,
            email,
            role
        })
        await newUser.save();
        res.status(200).send({ message: "User created succesfully" })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" })
    }
}

const Login= async(req, res)=>{
    try{
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        console.log(user)
        if (!user) {
          return res.status(401).json({ error: 'User not found' });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign(
          { email: user.email, role: user.role, userId:user._id },
          process.env.SECRET_KEY,
          { expiresIn: '12h' }
        ); 
    
        res.status(200).json({ token, user });
    
    }catch(error){
        console.log(error)
        res.status(500).json({message:"Internal Server Error"})
    }
}

module.exports = {
    createUser,
    Login
}