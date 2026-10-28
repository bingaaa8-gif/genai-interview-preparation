
const jwt = require("jsonwebtoken");

async function authuser(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Access token missing"
        });
    }

    const accessToken = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(
            accessToken,
            process.env.accesstoken
        );

        req.user = decoded;

        next();

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired access token"
        });
    }
}

module.exports = {authuser};
