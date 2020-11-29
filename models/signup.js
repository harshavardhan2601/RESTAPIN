var mongoose = require("mongoose");
var SignupSchema = new mongoose.Schema({
    surname:String,
    firstname:String,
    lastname:String,
    email:String,
    password:String,
    mobile_number:String,
    status:Number,
  create_date: {
    type: Date,
    default: Date.now
  }
  
});

mongoose.model("signup", SignupSchema );