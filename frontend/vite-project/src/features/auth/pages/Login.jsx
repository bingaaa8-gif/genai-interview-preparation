import React,{useState} from 'react'
import "../pages/login.scss"
import { useNavigate,Link } from 'react-router'
import { useAuth } from '../hooks/useAuth.jsx'
const Login = () => {
    const navigate=useNavigate()
    const{loading,handleLogin}=useAuth()
const[email,setEmail]=useState(" ")
const[password,setPassword]=useState(" ")
const submithandle=async(e)=>{
    e.preventDefault()
 const success= await handleLogin({email,password})
if (success) {
    navigate("/");
  }
}
if(loading){
    return(<main><h1>loading......</h1></main>)
}
  return (
   <main className="main">
<div className="form-container">
<h1>LOG IN</h1>
<form onSubmit={submithandle}>
<label htmlFor="email">EMAIL</label>
<input type="email" name='email' placeholder='enter your email'   className='input-group'  onChange={(e)=>{setEmail(e.target.value)}}/>
<label htmlFor="password">password</label>
<input 
onChange={(e)=>{setPassword(e.target.value)}}
 type="password" name='password'  placeholder='enter your password' className='input-group'/>
<button>Login</button>


</form>
<p>don't have an account?<Link to={"/Register"}>    Register here</Link></p>

</div>
   </main>
  )
}

export default Login
