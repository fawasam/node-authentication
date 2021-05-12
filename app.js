//level 2 security
//new dependency for       npm i mongoose-encryption     &&         npm  i dotenv

//mongoose-encryption method

  //in Save Section the password goes to encrypted
  //in find section the password goes to decrypted

  require("dotenv").config(); 
const express = require("express");
const bodyParse = require("body-parser");
const ejs = require("ejs");
const app = express();
const mongoose = require("mongoose");
const encrypt=require("mongoose-encryption");


console.log(process.env.SECRET)


app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParse.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/userDB" ,{useNewUrlParser:true ,useUnifiedTopology:true});

const userSchema = new mongoose.Schema({
  email:String,
  password:String
});


userSchema.plugin(encrypt , {secret:process.env.SECRET , encryptedFields:["password"]});


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
     password: req.body.password
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
  
  const password = req.body.password
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
