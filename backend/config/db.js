import mongoose from "mongoose";

export const connectDB = async()=>{
    await mongoose.connect("mongodb+srv://Gaurav:lHvggHeS07sEJkAc@cluster0.vdabi.mongodb.net/FOODDEL").then(()=>console.log("DB Connected"));
}