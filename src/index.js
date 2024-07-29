import dotenv from "dotenv"
import express from "express";
import connectDb from "./db/index.db.js";

console.log("HEREEE");
dotenv. config({
    path: './.env'
})

connectDb();


const app= express();



