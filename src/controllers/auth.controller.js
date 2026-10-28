const userModel = require("../model/user.model");
const bcrypt = require("bcryptjs");
const otpModel = require("../model/otp.modell");
const crypto = require("crypto");
const jwt=require("jsonwebtoken")
const sessionModel=require("../model/session.model")
const sendOtpEmail = require("../services/emailsending.service");
const blacklistModel=require("../model/blacklist.model")


async function registeruser(req, res) {
    try {
        const { username, email, password } = req.body;

        const isuser = await userModel.findOne({
            $or: [{ username }, { email }]
        });

        if (isuser) {
            return res.status(409).json({
                message: "User already exists"
            });
        }

        const hash = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            username,
            email,
            password: hash
        });

        const otp = crypto.randomInt(100000, 1000000).toString();
        const otphash = await bcrypt.hash(otp, 10);

        await otpModel.deleteMany({ email });

        await otpModel.create({
            email,
            otphash,
            user: user._id,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000)
        });

        await sendOtpEmail(email, otp);

        return res.status(201).json({
            message: "OTP sent to email."
        });

    } catch (error) {
        console.log("Registration error:", error);

        return res.status(500).json({
            message: "Registration failed"
        });
    }
}



async function otpverify(req, res) {
    try {
        const { otp, email } = req.body;

        if (!otp || !email) {
            return res.status(400).json({
                message: "Email and OTP are required"
            });
        }

        const otpRecord = await otpModel.findOne({
            email
        }).sort({ createdAt: -1 });

        if (!otpRecord || otpRecord.expiresAt <= new Date()) {
            return res.status(400).json({
                message: "OTP is invalid or expired"
            });
        }

        const isMatch = await bcrypt.compare(
            String(otp),
            otpRecord.otphash
        );

        if (!isMatch) {
            return res.status(400).json({
                message: "Incorrect OTP"
            });
        }

        const user = await userModel.findOneAndUpdate(
            { _id: otpRecord.user, email },
            { otpverify: true },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const refreshToken = jwt.sign(
            { id: user._id },
            process.env.refreshtoken,
            { expiresIn: "7d" }
        );

        const refreshtokenhash = crypto
            .createHash("sha256")
            .update(refreshToken)
            .digest("hex");

        const userAgent = req.headers["user-agent"];

        const session = await sessionModel.create({
            userid: user._id,
            refreshtokenhash,
            ip: req.ip,
            userAgent
        });

        const accessToken = jwt.sign(
            {
                id: user._id,
                sessionId: session._id
            },
            process.env.accesstoken,
            { expiresIn: "15m" }
        );

        res.cookie("refreshtoken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/"
        });

        await otpModel.deleteMany({ email });

        return res.status(200).json({
            message: "Email verified successfully",
            user,
            accesstoken: accessToken
        });

    } catch (error) {
        console.log("OTP verification error:", error);

        return res.status(500).json({
            message: "OTP verification failed"
        });
    }
}

async function login(req,res){
    const{email,password}=req.body
   const userAgent=req.headers["user-agent"]
const isuser=await userModel.findOne({email})
if(!isuser){
    return res.status(401).json({
        message:"inavlid email or password"
    })
}
if(!isuser.otpverify){
    return res.status(401).json({
        message:"verify email"
    })
}
const matchpas=await bcrypt.compare(password,isuser.password)
if(!matchpas){
    return res.status(401).json({
        message:"inavlid email or password"
    })
}


const refreshToken=await jwt.sign({id:isuser._id},process.env.refreshtoken,   { expiresIn: "7d" })
const refreshtokenhash = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");
const session=await sessionModel.create({
    userid:isuser._id,
    refreshtokenhash,
    ip:req.ip,
    userAgent
}) 


const accessToken=await jwt.sign({id:isuser._id,sessionId:session._id},process.env.accesstoken,   { expiresIn: "15m" })
  res.cookie("refreshtoken", refreshToken)
return res.status(200).json({
            message: "Login successful",
          user:isuser,accesstoken: accessToken,
            
        })
}

async function refreshtokens(req,res){
    const refreshtoken=req.cookies.refreshtoken;
    if(!refreshtoken){
        return res.status(401).json({
            message:"unauthorized"
        })
    }
    const decoded=jwt.verify(refreshtoken,process.env.refreshtoken)
     const user = await userModel.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                message: "User not found. Please login again"
            });
        }

  const refreshtokenhash = crypto
        .createHash("sha256")
        .update(refreshtoken)
        .digest("hex");
const session=await sessionModel.findOne({
    refreshtokenhash,
    revoked:false
})
if(!session){
     return res.status(400).json({
            message:"invalid refresh token"
        })
}

        const accessToken = jwt.sign(
    { id: user._id,sessionId: session._id   },
    process.env.accesstoken,
    { expiresIn: "15m" }
)

const newRefreshToken = jwt.sign(
    { id: user._id },
    process.env.refreshtoken,
    { expiresIn: "7d" }
)
  const newrefreshtokenhash = crypto
        .createHash("sha256")
        .update(newRefreshToken)
        .digest("hex");
session.refreshtokenhash=newrefreshtokenhash
await session.save()

res.cookie("refreshtoken", newRefreshToken)
  return res.status(200).json({
            message: "Access token refreshed successfully",
               user: user,
            accesstoken: accessToken
        })

    }
async function logout(req, res) {
    const refreshtoken = req.cookies.refreshtoken;

    if (!refreshtoken) {
        return res.status(401).json({
            message: "unauthorized"
        });
    }

    const decoded = jwt.verify(
        refreshtoken,
        process.env.refreshtoken
    );

    const refreshtokenhash = crypto
        .createHash("sha256")
        .update(refreshtoken)
        .digest("hex");

    const session = await sessionModel.findOne({
        userid: decoded.id,
        refreshtokenhash,
        revoked: false
    });

    if (!session) {
        return res.status(401).json({
            message: "invalid refresh token"
        });
    }

    session.revoked = true;
    await session.save();
    

    res.clearCookie("refreshtoken");

    return res.status(200).json({
        message: "logged out successfully"
    });
}

module.exports = {
    registeruser,
    otpverify,login,refreshtokens,logout
};