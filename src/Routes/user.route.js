const express=require("express")
const authcontroller=require("../controllers/auth.controller")
const router=express.Router()


router.post("/register",authcontroller.registeruser)
router.post("/login",authcontroller.login)
router.post("/refreshtoken",authcontroller.refreshtokens)
router.post("/verifyotp",authcontroller.otpverify)
router.get("/logout",authcontroller.logout)
module.exports=router
