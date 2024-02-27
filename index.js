const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://Mohit_Thakral_249:Mohit2493@cluster0.uqxumod.mongodb.net/?retryWrites=true&w=majority");

const express = require("express");
const app = express();

//for user routes
const userRoute = require('./routes/userRoute');
app.use('/',userRoute);

//Port Range
app.listen(3000,function(){
    console.log("Server is running...");
});