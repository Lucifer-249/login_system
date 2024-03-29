const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const { request } = require('express');
const nodemailer = require("nodemailer");

//FOr converting password to Hash
const securePassword = async(password)=>{
    try {

        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;
        
    } catch (error) {
        console.log(error.message);
    }
}

//for sending mail
const sendVerifyMail = async(name, email, user_id)=>{

    try {
        const transporter = nodemailer.createTransport({
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:'thakralmohit95@gmail.com',
                pass:'vker ihfj trhe iptl'
            }
        });
        const mailOptions = {
            from:'thakralmohit95@gmail.com',
            to:email,
            subject:'For Verification of Email-ID',
            html:'<p>Hello '+name+' , Please click here to <a href="http://127.0.0.1:3000/verify?id='+user_id+'"> Verify </a> your mail.</p>'
        }
        transporter.sendMail(mailOptions, function(error,info){
            if(error){
                console.log(error);
            }
            else{
                console.log("Email has been sent:- ", info.response);
            }
        })
    } catch (error) {
        console.log(error.message);
    }
}

//For registraion
const loadRegister = async(req,res)=>{
    try{
        async:true
        res.render('registration');

    }catch (error){
        console.log(error.message);
    }
}

//For inserting the User
const insertUser = async(req,res)=>{

    try {
        const spassword = await securePassword(req.body.password);
        const user = new User({
            name:req.body.name,
            email:req.body.email,
            mobile:req.body.mno,
            image:req.file.filename,
            password:spassword,
            is_admin:0
        });

        const userData = await user.save();

        if(userData){
            sendVerifyMail(req.body.name, req.body.email, userData._id);
            res.render('registration',{message:"Your registration is SUCCESSFULL, Please verify your mail."});
        }
        else{
            res.render('registration',{message:"Your registration has been FAILED."});
        }
    } catch (error) {
        console.log(error.message)
    }
}

//For Verification of Email-ID
const verifyMail = async(req,res)=>{
    try {
        const updateInfo = await User.updateOne({_id:req.query.id},{ $set:{is_verified:1}});
        console.log(updateInfo);
        res.render("email-verified");
    } catch (error) {
        console.log(error.message);
    }
}

//Exporting modules
module.exports = {
    loadRegister,
    insertUser,
    verifyMail
}