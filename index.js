import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import {connectDB} from "./database.js";
import {User} from "./model.js";
import dotenv from "dotenv";
import {logger} from "./middleware.js";
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))

// connect to mongo cloud
connectDB();
//to access env file
dotenv.config();



app.use(logger);
// routes

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

app.post("/api/v1/users",async (req,res)=>{
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
        res.status(200).send({message:"user added!",id});
    } else {
        res.status(400).send({message:"Unable to save user"});
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
    const response = await User.update({user_id: id},user);
    console.log(response)
    if(response.n) {
        res.status(200).send({message:"updated!",data: user});
    } else {
        res.status(400).send({message:"Unable to update user"});
    }
});

app.delete("/api/v1/users/:id",async (req,res)=>{
     const id = req.params.id;
     const response = await User.deleteOne({user_id: id});
     res.status(200).send({message:`user with id ${id} is deleted successfully`});
})

const PORT = process.env.APP_PORT || 3000;
app.listen((PORT),()=>{
    console.log(`Server running at Port ${PORT}`);
});

