const mongoose=require ("mongoose")


const technicalquestions=new mongoose.Schema({
    questions:{
        type:String,
        required:true
    },

    intentions:{
        type:String,
        required:true
    },
    answers:{
        type:String,
        required:true
    }
},{
    _id:false
})
const behavioralquestions=new mongoose.Schema({
    questions:{
        type:String,
        required:true
    },

    intentions:{
        type:String,
        required:true
    },
    answers:{
        type:String,
        required:true
    }
},{
    _id:false
})

const skillsgap=new mongoose.Schema({
    skills:{
        type:String,
        required:true,
      
    }
},{
    _id:false
})
const preprationplans=new mongoose.Schema({
    day:{
        type:Number,
    required:true
    },
    focus:{
        type:String,
        required:true
    },
    task:{
        type:String,
        required:true
    }
    

},{
    _id:false
})
const reportSchema =new mongoose.Schema({
    jobDes:{
        type:String,
        required:true
    },
    resume:{
        type:String
    },
   selfDes: {
type:String
    },
    matchscope:{
        type:Number,
        min:0,
        max:100
    },
    technicalQuestion:[technicalquestions],
    behavioralQuesttions:[behavioralquestions],
    skillgap:[skillsgap],
    preprationplan:[preprationplans],
   user: {
type:mongoose.Schema.Types.ObjectId,
ref:"user"
    }

},{
    timestamps:true
})

const reportModel=mongoose.model("reports",reportSchema)
module.exports=reportModel