import express, { urlencoded } from "express"
import mongoose from "mongoose"

const app = express()
app.use(express.json())
app.use(urlencoded({extended:true}))

mongoose.connect("URL",
{
    dbName:"MernDataBase"
})
// ----------------------------------------------Schema-------------------------------------------------------------
const userSchema = mongoose.Schema({
    username: {type: String,required: true},
    password: {type: String,required: true}
});

const User = mongoose.model('collection', userSchema);
// ----------------------------------------------APIs-------------------------------------------------------------
                                        
app.get("/getUsers",async(req,res)=>{
    const user= await User.find()
    res.json(user)
})

app.post("/postUsers",async(req,res)=>{
    const {username,password}=req.body
    const user= await User.findOne({username})
    if(user){
        res.json({message:"User already Exist"})
    }else{
    const createdUser= await User.create({username,password})
    res.json({message:"User Added",createdUser})
    }
})

app.put("/putUsers/:id",async(req,res)=>{

    try {
        let user = await User.findById(req.params.id)
        if(!user){
          return res.json({message:"User does not exist"})
        }
        
        else   {user = await User.findByIdAndUpdate(req.params.id,req.body,{new:true,useFindAndModify:true,runValidators:true})
        res.json({message:"User updated",user})}
    } catch (error) {
        console.log(error);
    }

    
})

app.delete("/deleteUsers/:id",async(req,res)=>{
    try {
        const user= await User.findById(req.params.id)
        if(!user){
          return res.json({message:"User does not exist"})
        }
        await user.deleteOne()
        res.json({message:"User Deleted"})

    } catch (error) {
        console.log(error)
    }

})

// -----------------------------------------------------------------------------------------------------------

app.listen(3001,()=>console.log("Server running"))