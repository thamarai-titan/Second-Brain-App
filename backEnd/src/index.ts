import express from 'express';
import jwt from 'jsonwebtoken'
import cors from 'cors'
import { ContentModel, LinkModel, UserModel } from './db';
import { JWT_PASSWORD } from './config';
import { userMiddleware } from './middleware';
import { random } from './utils';

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

app.post("/api/v1/content",userMiddleware,async(req,res)=>{
    const link = req.body.link;
    const type = req.body.type;

    await ContentModel.create({
        link,
        type,
        title:req.body.title,
        userId:req.userId,
        tags:[]
    })

    res.json({
        message:"Content Added"
    })
})


app.get("/api/v1/content",userMiddleware,async(req,res)=>{
    const userId = req.userId
    const content = await ContentModel.find({
        userId:userId
    }).populate("userId","username")

    res.json({
        content
    })
})

app.delete("/api/v1/content",userMiddleware,async(req,res)=>{
    const contentId = req.body.contentId;

    await ContentModel.deleteMany({
        contentId,
        userId:req.userId
    })
    res.json({
        message:"Deleted"
    })
})

app.post("/api/v1/brain/share",userMiddleware,async(req,res)=>{
    const share = req.body.share;

    if(share){
        const existingLink = await LinkModel.findOne({
            userId:req.userId
        });

        if(existingLink){
            res.json({
                hash:existingLink.hash
            })
            return;
        }
        const hash = random(10)
        await LinkModel.create({
            userId:req.userId,
            hash:hash
        })
        res.json({
            hash
        })
    }
    else{
        await LinkModel.deleteOne({
            userId:req.userId
        })

        res.json({
            message:"Link Removed"
        })
    }

})

app.get("/api/v1/brain/:sharelink",async(req,res)=>{
    const hash = req.body.sharelink
    const link = await LinkModel.findOne({
        hash
    })
    if(!link){
        res.status(411).json({
            message:"Sorry incorrect input"
        })
        return;
    }
    const content = await ContentModel.find({
        userId:link.userId
    })
    console.log(link);

    const user = await UserModel.findOne({
        _id:link.userId
    })

    if(!user){
        res.status(411).json({
            message:"user not found, error should ideally not happen"
        })
        return;
    }

    res.json({
        username:user.username,
        content:content
    })
})
app.listen(3000)