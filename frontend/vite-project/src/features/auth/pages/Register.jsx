import React,{useState} from 'react'
import { useNavigate,Link } from 'react-router'
import "../pages/login.scss"
import { useAuth } from '../hooks/useAuth.jsx'
const Register = () => {
    const{loading,handleRegister}=useAuth()
    const navigate=useNavigate()
    const[username,setUsername]=useState(" ")
    const[email,setEmail]=useState(" ")
    const[password,setPassword]=useState(" ")
    const submitRegister= async (e)=>{
    e.preventDefault()
   const success=  await handleRegister({username,email,password})
    if(success){ 
   navigate("/otpverify")}
}
if(loading){
    return(<main><h1>loadingg......</h1></main>)
}
  return (
     <main className="main">
<div className="form-container">
<h1>Register</h1>
<form onSubmit={submitRegister}>
<label htmlFor="email">Email</label>
<input onChange={(e)=>{setEmail(e.target.value)}} type="email" placeholder='enter your email' name='email' className='input-group'/>
<label htmlFor="name">Name</label>
<input
onChange={(e)=>{setUsername(e.target.value)}}
 type="text" placeholder='enter your name' name='username' className='input-group'/>
<label htmlFor="password">password</label>
<input 
onChange={(e)=>{setPassword(e.target.value)}}
type="password" placeholder='enter your password' name='password' className='inpu-group'/>


<button>Register</button>


</form>
<p>already have an account?<Link to={"/login"}>   Login</Link></p>
</div>
   </main>
  )
}

export default Register
