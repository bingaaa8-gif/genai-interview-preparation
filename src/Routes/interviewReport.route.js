const express=require ("express")
const authmiddleware=require("../middleware/auth.middleware")
const irController=require("../controllers/ir.controller")
const upload=require("../middleware/file.middleware")
const router=express.Router()

router.post("/report",authmiddleware.authuser,upload.single("resume"),irController.irController)
router.get("/report/:id",authmiddleware.authuser,irController.reportbyid)
router.get("/allreport",authmiddleware.authuser,irController.allreport)


module.exports=router