const app=require ("./src/app")
const connectDb=require("./src/config/db")
require("dotenv").config()
const interviewAiReport=require("./src/services/ai.service")

connectDb()

app.listen(3000,()=>{
    console.log("server is running on port3000")
})