import express from "express";
import bodyParser from "body-parser";
import {connectDB} from "./database.js";
import {User,Admin} from "./model.js";
import dotenv from "dotenv";
import {
    logger,
    generateAccessToken,
    verifyAcessToken,
    validateAdminSignup,
    validateUserInsertion
} from "./middleware.js";
import bcrypt from "bcrypt";
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))

// connect to mongoDB cloud
connectDB();

// access env file
dotenv.config();



app.use(logger);
app.use(verifyAcessToken);

// routes
app.post("/api/v1/admin/signup", validateAdminSignup ,async (req,res)=>{
    const id = ++(await Admin.find()).length;
    const {name,email,password} = req.body;
    const admin = {
        name,
        email,
        password: await bcrypt.hash(password,10)
    };
    const newAdmin =  await Admin.create(admin);
    if(newAdmin.save()) {
        const token = generateAccessToken(name);
        res.status(200).header("Bearer-Token",token).send({message:"admin added!",id});
    } else {
        res.status(400).send({message:"Unable to register admin"});
    }
});

app.post("/api/v1/admin/signin", async (req,res)=>{
    const {email,password} = req.body;
    const admin = await Admin.findOne({email});
    const verified = await bcrypt.compare(password,admin.password);
    if(verified) {
        const token = generateAccessToken(admin.name);
        res.status(200).header("Bearer-Token",token).send({message:"admin logged in successfully!"});
    } else {
        res.status(400).send({message:"Unable to login admin"});
    }
});



app.get("/api/v1/users", async (req,res)=>{
    const users = await User.find();
    if(users) {
        res.status(200).send(users);
    } else {
        res.status(400).send({message:"Error fetching users"});
    }
})

app.get(`/api/v1/users/:id`, async (req,res)=>{
     const user = await User.find({user_id: req.params.id});
     if(user.length) {
        res.status(200).send(user);
     } else {
         res.status(400).send({message:`No user found with id ${req.params.id}`});
     }
});

app.post("/api/v1/users", validateUserInsertion, async (req,res)=>{
    const id = ++(await User.find()).length;
    const { name,email,phno } = req.body;
    console.log(phno);
    const user = {
        "user_id":id,
        name,
        email,
        phno
    };

    const newUser = await User.create(user);
    if(newUser.save()) {
        res.status(200).send({message:"User added!",id});
    } else {
        res.status(400).send({message:"Unable to add user"});
    }
});

app.put("/api/v1/users/:id",async (req,res) => {
    const { name,email,phno } = req.body;
    const id = req.params.id;
    const user = {
        "user_id":id,
        name,
        email,
        phno
    };
    const response = await User.updateOne({user_id: id},user);
    console.log(response)
    if(response.n) {
        res.status(200).send({message:"User details updated!", data: user});
    } else {
        res.status(400).send({message:"Unable to update user"});
    }
});

app.delete("/api/v1/users/:id",async (req,res)=>{
     const id = req.params.id;
     const response = await User.deleteOne({user_id: id});
     console.log(response);
     if(response.n) {
         res.status(200).send({message:`user with id ${id} is deleted successfully`});
     } else {
         res.status(400).send({message: `User nor found with ID ${id}`});
     }

})

const PORT = process.env.APP_PORT || 3000;
app.listen((PORT),()=>{
    console.log(`Server running at Port ${PORT}`);
});

