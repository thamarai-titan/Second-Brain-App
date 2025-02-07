import mongoose,{model,Schema} from "mongoose";
mongoose.connect("mongodb+srv://tmanalan711:Thamarai@cluster0.xqnzc.mongodb.net/Second-Brain")

const UserSchema = new Schema({
    username: {type:String,unique: true},
    password:String

})

const ContentSchema = new Schema({
    title:String,
    link:String,
    tags:[{type:mongoose.Types.ObjectId,ref:'Tag' }],
    type:String,
    userId: {type: mongoose.Types.ObjectId,ref:'User',required: true},
})

const LinkSchema = new Schema({
    hash:String,
    userId:{type: mongoose.Types.ObjectId,ref:'User',required:true,unique:true},
})

export const UserModel = model("User",UserSchema)
export const ContentModel = model("Content",ContentSchema)
export const LinkModel = model("Links",LinkSchema)