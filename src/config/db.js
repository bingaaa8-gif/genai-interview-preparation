const mongoose=require("mongoose")

async function connectDb() {
    mongoose.connect(process.env.mongoose_uri)
    console.log("connected to db")
}

module.exports=connectDb