import mongoose from "mongoose";

const {Schema , model} = mongoose;

const userSchema = new Schema({
    user_id: String,
    name: String,
    email: String,
    phno: String
});
export const User = model('User',userSchema);

const adminSchema = new Schema({
    admin_id: String,
    name: String,
    email: String,
    password: String
});

export const Admin = model('Admin', adminSchema);

