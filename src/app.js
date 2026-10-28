const express=require ("express")
const app=express()
const authroutes=require("./Routes/user.route")
const reportroutes=require("./Routes/interviewReport.route")
const cookieparser=require("cookie-parser")
const cors=require ("cors")


app.use(express.json())
app.use(cookieparser())
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))


app.use("/api/auth",authroutes)
app.use("/api/interview",reportroutes)





module.exports=app