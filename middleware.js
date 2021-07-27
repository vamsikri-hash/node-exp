import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

export const logger = (req, res, next) => {
    console.log("Logging req header details : ");
    console.log(req.headers);
    next();
};

export const generateAccessToken = (username) => {
    const token = jwt.sign(username, process.env.myprivatekey); //get the private key from the config file -> environment variable
    return token;
};

export const verifyAcessToken = (req, res, next) => {
    if(req.path === "/api/v1/admin/signup" || req.path === "/api/v1/admin/signin") {
      next();
      return;
    }

    const token = req.headers["bearer-token"];
    if(!token) {
        res.status(401).send({message:"Access Denied! No token received"});
    }

    try {
        const user = jwt.verify(token,process.env.myprivatekey);
        req.user = user;
        next();
    } catch(err) {
        res.status(400).send({message:"Invalid Token"});
    }
};