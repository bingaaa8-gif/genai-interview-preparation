
import React,{useState} from 'react'
import {Interviewhook} from '../../auth/hooks/Interviewhook'
import { useNavigate} from 'react-router'
import "./home.scss"
const Home = () => {
   const navigate=useNavigate()
  
const {loading, handlecreatereport } = Interviewhook();
    const[sdec,setSdec]=useState("")
const[jdec,setJdec]=useState("")
const [resume, setResume] = useState(null);
const handlesubmit=async(e)=>{
e.preventDefault();
 const id = await handlecreatereport(resume, sdec, jdec);

    if (id) {
        navigate(`/report/${id}`);
    }
}
if(loading){
    return(<main><h1>loading......</h1></main>)
}

  return (
    <div>
        <h1>Interview Report Gneration</h1>
         <form  onSubmit={handlesubmit}>
      <main>
        
       
        <div className="left">
          <label htmlFor="selfDes">Self Description</label>
          <textarea
          onChange={(e)=>{setSdec(e.target.value)}}
            name="selfDes"
            id="selfDes"
            className="text"
            placeholder="Enter self description"
          />
        </div>

        <div className="right">
          <label htmlFor="resume">Upload Resume</label>
          <input
          onChange={(e) => setResume(e.target.files[0])}
            type="file"
            name="resume"
            id="resume"
            accept=".pdf"
          />

          <label htmlFor="jobDes">Job Description</label>
          <textarea
          onChange={(e)=>{setJdec(e.target.value)}}
            name="jobDes"
            id="jobDes"
            placeholder="Enter job description"
          />

          <button>Generate Report</button>
    
        </div>
       
      </main>
       </form>
    </div>
  )
}

export default Home
