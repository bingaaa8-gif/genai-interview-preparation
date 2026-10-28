import React,{useState} from 'react'
import { useNavigate,Link } from 'react-router'
import { useAuth } from '../hooks/useAuth.jsx'
const Otpverify = () => {
const navigate=useNavigate()
    const{loading,handleotp}=useAuth()
const[email,setEmail]=useState("")
const[otp,setOtp]=useState("")
const submithandle=async(e)=>{
    e.preventDefault()
const success=await handleotp({email,otp})
if (success) {
    navigate("/");
  }
}

if(loading){
    return(<main><h1>loading......</h1></main>)
}
  return (
    <div>
    <main className="main">
<div className="form-container">
<h1>OTP VERIFICATION</h1>
<form onSubmit={submithandle}>
<label htmlFor="email">EMAIL</label>
<input type="email" name='email' placeholder='enter your email'   className='input-group'  onChange={(e)=>{setEmail(e.target.value)}}/>
<label htmlFor="otp">OTP</label>
<input 
onChange={(e)=>{setOtp(e.target.value)}}
 type="password" name='text'  placeholder='enter otp' className='input-group'/>
<button>verify</button>


</form>


</div>
   </main>
    </div>
  )
}

export default Otpverify
