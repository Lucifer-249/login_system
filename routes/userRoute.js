const express = require("express");
const user_route = express();

user_route.set('view engine','ejs');
user_route.set('views','./views/users');

const bodyParser = require('body-parser');
user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({extended:true}));
user_route.use(express.static('public'));

//Using multer for uploading pictures
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: "../public/userImages",
    filename:(req,file,cb)=>{
        const name = Date.now()+'-'+file.originalname;
        cb(null,name);
    }
    
});
const upload = multer({storage:storage});

const userController = require("../controllers/userController");

user_route.get('/register',userController.loadRegister);

user_route.post('/register',upload.single('image'),userController.insertUser);

user_route.get('/verify',userController.verifyMail);

module.exports = user_route;