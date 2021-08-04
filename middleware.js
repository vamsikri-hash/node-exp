import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import Joi from "joi";

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

export const validateAdminSignup = (req, res, next) => {
    const adminSchema = Joi.object({
        name: Joi.string().min(3).max(20).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(5).required()
    })
    const {error} = adminSchema.validate({...req.body});
    if(error) {
        res.status(400).send({message: `validation failed : ${error.message}`});
    }
    next();
}


export const validateUserInsertion = (req, res, next) => {
    const userSchema = Joi.object({
        name: Joi.string().min(3).max(20).required(),
        email: Joi.string().email().required(),
        phno: Joi.string().min(10).max(10).required()
    })
    const {error} = userSchema.validate({...req.body});
    if(error) {
        res.status(400).send({message: `validation failed : ${error.message}`});
    }
    next();
}

