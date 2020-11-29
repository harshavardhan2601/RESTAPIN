var mongoose = require("mongoose");
var EmployeeSchema = new mongoose.Schema({
  typeofemployee: String,
  ename: String,
  email: String,
  ecellno: String,
  epassword: String,
  status: Number,
  create_date: {
    type: Date,
    default: Date.now
  }
});

mongoose.model("employee", EmployeeSchema);