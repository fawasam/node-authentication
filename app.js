//level 2 security
//new dependency for       npm i mongoose-encryption     &&         npm  i dotenv

//mongoose-encryption method

  //in Save Section the password goes to encrypted
  //in find section the password goes to decrypted


  //level 3 security
  //new dependency for npm i md5

//md5 method
 //hasing is the main encryption used here  hashing  (register)=>md5(req.body.password)== (login)=>md5(req.body.password)

  require("dotenv").config(); 
const express = require("express");
const bodyParse = require("body-parser");
const ejs = require("ejs");
const app = express();
const mongoose = require("mongoose");
const md5=require("md5");



app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParse.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/userDB" ,{useNewUrlParser:true ,useUnifiedTopology:true});

const userSchema = new mongoose.Schema({
  email:String,
  password:String
});


const User =new mongoose.model("User" ,userSchema); 


//home
app.get("/", (req, res) => {
  res.render("home");
});


//register
app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
   const newUser =new User({
     email: req.body.username,
     password: md5(req.body.password)
  })

   // Mongoose Model.findOne()
   let errors =[];
   User.findOne({email:req.body.username}).then(user=>{
    if(user){
        res.render('register',{errors})
        console.log("email already exists")
    }
   //EMAIL EXIST CHECK SECTION END
    else{
       //in Save Section the password goes to encrypted
      newUser.save( (err, user) => {
        if (err) {
          console.log(err);
        }
        else{
          res.render("secrets")
        }
      });
    }
})
})


//login
app.get("/login", (req, res) => {
  res.render("login");
});

app.post('/login' ,(req, res) => {
  const username = req.body.username
  
  const password =  md5(req.body.password)
  //in find section the password goes to decrypted
  User.findOne({ email: username }, (err, foundUser) => {
    if (err) {
      console.log(err);
      alert("credentials have errors please check proper id and password")
    }
    else{
      if (foundUser)
      {
        if (foundUser.password === password)
        {
          res.render("secrets")
          console.log("success")
        }
      }
    }
  })
})
app.listen(3000, function () {
  console.log("hii you are in port 30000");
});
