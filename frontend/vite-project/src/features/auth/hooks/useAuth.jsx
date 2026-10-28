import { useContext } from "react";
import {authContext} from "../services/auth.context.jsx"
import{register,otpverify,login,logout,refreshToken} from "../services/auth.api.jsx"


export const useAuth=()=>{
    const context=useContext(authContext)
    const {user,setUser,loading,setLoading, setAccesstoken}=context

    const handleLogin=async({email,password})=>{
        setLoading(true)
        try{
       const data= await login({email,password})
       setUser(data.user)
       setAccesstoken(data.accesstoken);
    return true
    }
       
       catch(err){
        console.log(err)
        return false;
       }
       finally{
       setLoading(false)}
    }

    const handleRegister = async ({ email, username, password }) => {
    setLoading(true);

    try {
        const data = await register({ username, email, password });
        setUser(data.user);
        return true;
    } catch (err) {
        console.log(err);
        return false;
    } finally {
        setLoading(false);
    }
};
   
const handleotp = async ({ email, otp }) => {
    setLoading(true);

    try {
        const data = await otpverify({ email, otp });
        setUser(data.user);
        return true;
    } catch (err) {
        console.log(err.response?.data || err.message);
        return false;
    } finally {
        setLoading(false);
    }
};

    const  handlerefreshToken=async()=>{
        setLoading(true)
        try{
        const data =await refreshToken()
        setUser(data.user)
    return true
    }
    catch(err){
        console.log(err)
        return false
    }

    finally {
        setLoading(false)
    }
    }
    const handlelogout=async()=>{
        setLoading(true)
        const data=await logout()
        setUser(null)
        setLoading(false)
    }
    return{user,loading,handleRegister,handleLogin,handlelogout,handleotp,handlerefreshToken}
}