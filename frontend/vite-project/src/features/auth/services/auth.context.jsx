import { createContext, useState,useEffect } from "react";
import { refreshToken } from "./auth.api";
import { setAccessToken } from "./axiosInstance";
export const authContext=createContext()
export const AuthProvider=({children})=>{
    const[user,setUser]=useState(null);
    const[loading,setLoading]=useState(true);
    const[report,setReport]=useState(null);
    const [accesstoken, setAccesstoken] = useState(null);
    const[reports,setReports]=useState(null)
    useEffect(() => {
    const checkUser = async () => {
        try {
            const data = await refreshToken();
            setUser(data.user);
            setAccesstoken(data.accesstoken);
            setAccessToken(data.accesstoken);
        } catch (err) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    checkUser();
}, []);

    return(

        <authContext.Provider value={{user,setUser,loading,setLoading,report,setReport,accesstoken,
setAccesstoken,reports,setReports}}>
        {children}
        </authContext.Provider>
    )
}