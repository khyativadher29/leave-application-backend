const express= require('express');
const mongoose= require('mongoose');
const dotenv =require('dotenv');
const cors= require('cors')
const userRoutes= require('./Routes/User')
const leaveRoutes= require('./Routes/Leave')

dotenv.config()
mongoose.connect(process.env.MONGODB_CONNECTION_URL,{
    useNewUrlParser: true,   }).then(()=>{
        console.log("MongoDb Connected Succesfully");
    }).catch((err)=>{
        console.log(err)
    })

const app= express();
app.use(cors());
app.use(express.json());

//user routes
app.use('/user',userRoutes);

//leave routes
app.use('/leave',leaveRoutes)

const Port = process.env.PORT ||5000;

app.listen(Port,()=>{
    console.log(`Server is running on port ${Port} `)
})