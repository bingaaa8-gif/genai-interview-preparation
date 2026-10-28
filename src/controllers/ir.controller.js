const { PDFParse } = require("pdf-parse");
const interviewAiReport=require("../services/ai.service")
const  reportModel=require("../model/report.model")


async function irController(req,res){
const resumefile=req.file
const parser = new PDFParse({
    data: req.file.buffer
});

const pdfData = await parser.getText();
const resumecontent = pdfData.text;

await parser.destroy();
const{selfDes,jobDes}=req.body
const interviewReport=await interviewAiReport({
    resume:resumecontent,selfDes,jobDes
})
const report=await reportModel.create(
    {
        user:req.user.id,
        resume:resumecontent,selfDes,jobDes,
        ...interviewReport


})
  return res.status(201).json({
    message:"repoert",
    report
    }
)

}
async function  reportbyid(req,res) {
    const reportid=req.params.id
    const report=await  reportModel.findOne({
        _id:reportid,
        user:req.user.id
    })
    if(report){
        return res.status(200).json(({
            message:"report",
            report
        }))
    }
    return res.json({
        message:"not foun  report"
    })

}
async function allreport(req,res){
    const reports=await  reportModel.find({
        
        user:req.user.id
    })
    if(reports){
        return res.status(200).json(({
            message:"report",
            reports
        }))
    }
    return res.json({
        message:"not foun  report"
    })

}
module.exports={irController,reportbyid,allreport}