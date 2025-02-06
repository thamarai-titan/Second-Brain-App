import express from 'express';
import jwt from 'jsonwebtoken'
import cors from 'cors'
import { UserModel } from './db';
import { JWT_PASSWORD } from './config';

const app = express()
app.use(express.json())
app.use(cors())

app.post("/api/v1/signup",async (req,res)=>{
    const username = req.body.username
    const password = req.body.password

    try{
        await UserModel.create({
            username:username,
            password:password
        })
        res.json({
            message:"User Signed Up"
        })
    }
    catch(e){
        res.status(411).json({
            message:"User already Exits"
        })

    }
})

app.post("/api/v1/signin",async (req,res)=>{
    const username = req.body.username
    const password = req.body.password

    const existingUser = await UserModel.findOne({
        username,
        password,
    })
    if(existingUser){
        const token = jwt.sign({
            id:existingUser._id
        },JWT_PASSWORD)
        res.json({
            token
        })
    }
    else{
        res.status(403).json({
            message:"Incorrect credentials"
        })
    }

    
})

app.listen(3000)