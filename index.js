import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import {connectDB} from "./database.js";
import {User} from "./model.js";
import dotenv from "dotenv";
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))

// connect to mongo cloud
connectDB();
//to access env file
dotenv.config();



// routes

app.get("/api/v1/users", async (req,res)=>{
    const users = await User.find();
    res.status(200).send(users);
})

app.get(`/api/v1/users/:id`, async (req,res)=>{
     const user = await User.find({user_id: req.params.id});
     res.status(200).send(user);
});

app.post("/api/v1/users",async (req,res)=>{
    const id = (await User.find()).length++;
    const { name,email,phno } = req.body;
    const user = {
        "user_id":id,
        name,
        email,
        phno
    };

    const newUser = await User.create(user);
    newUser.save();
    res.send({"status":"user added!"});
});

app.put("/api/v1/users/:id",async (req,res) => {
    const { name,email,phno } = req.body;
    const user = {
        "user_id":id,
        name,
        email,
        phno
    };
    const response = await User.update({user_id: req.params.id},user);
    res.send({"message":"updated!"});
});

app.delete("/api/v1/users/:id",async (req,res)=>{
     const response = await User.deleteOne({user_id: req.params.id});
     res.status(200).send(response);
})

const PORT = process.env.APP_PORT || 3000;
app.listen((PORT),()=>{
    console.log(`Server running at Port ${PORT}`);
});