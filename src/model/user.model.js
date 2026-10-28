const mongoose=require("mongoose")

const userSchema= new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
         match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email"],
         trim:true,
         lowercase:true
    },
    password:{
        type:String,
        required:true,
        minlength:8
    },
    otpverify:{
        type:Boolean,
        default:false
    }
},{timestamps:true}
)

const userModel=mongoose.model("user",userSchema)
module.exports=userModel
