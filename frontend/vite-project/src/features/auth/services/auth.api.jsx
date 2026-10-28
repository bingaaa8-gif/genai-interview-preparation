import axios from "axios"


export async function register({ username, email, password }) {
    const response = await axios.post(
        "http://localhost:3000/api/auth/register",
        { username, email, password },
        { withCredentials: true }
    );

    return response.data;
}


export async function otpverify({ email, otp }) {
    const response = await axios.post(
        "http://localhost:3000/api/auth/verifyotp",
        {
            email,
            otp
        },
        {
            withCredentials: true
        }
    );

    return response.data;
}

export async function login({email,password}){

try{
    const response=await axios.post("http://localhost:3000/api/auth/login",{
        email,password
    },{
        withCredentials:true
    })
    return response.data
}
catch(err){
 console.log(err.response?.data || err.message);
    throw err;
}

}
export async function logout(){
    try{
        const response= await axios.get("http://localhost:3000/api/auth/logout",{
            withCredentials:true
        })
        return response.data
    }
    catch(err)
{
    console.log(err)
}}
export async function refreshToken() {
    try {
        const response = await axios.post(
            "http://localhost:3000/api/auth/refreshtoken",
            {},
            { withCredentials: true }
        );

        return response.data;
    } catch (err) {
        console.log(err);
        throw err;
    }
}