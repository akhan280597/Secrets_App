require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true,useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
  email:String,
  password:String
});

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });

const User = mongoose.model("User",userSchema);

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({
  extended:true
}));

app.use(express.static("public"));

app.get("/",function(req,res)
{
  res.render("home");
});

app.get("/login",function(req,res)
{
  res.render("login");
  swal("Enter your username and password");
});


app.get("/register",function(req,res)
{
  res.render("register");
});

app.post("/register",function(req,res){
  const newUser = new User({
    email:req.body.username,
    password:req.body.password
  });

  newUser.save(function(err){
    if(!err)
    {
      res.render("secrets");
    }
    else{
      res.send(err);
    }
  })
});

app.post("/login",function(req,res){
    console.log("in login post route");
  const username = req.body.username;
  console.log(username);
  const password = req.body.password;
  console.log(password);
  User.findOne({email:username},function(err,founduser)
  {
    if(err){
      console.log(err);
      res.send(err);
    }
    else {
      console.log(founduser);
      if(founduser.password === password)
      {
          console.log("in render secrets page if");
        res.render("secrets");
      }
    }
  });
});

app.listen("3000", function() {
  console.log("Listening on port 3000");
})
