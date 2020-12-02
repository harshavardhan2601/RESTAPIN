var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");
var nodemailer = require('nodemailer');



function send_mailing(maildata) {
  var data = {};
  data.to = maildata.to_email;
  data.subject = maildata.subject;
  data.body = maildata.template;

  //  attachments: [{'filename': 'attachment.txt', 'content': data}]
  try {
      var from_user = 'info@surgicalbooking.com';
      var Transport = nodemailer.createTransport({
          service: "gmail",
          auth: {
              user: from_user,
              pass: "Booking@2526"
          }
      });
      var mail = {
          from: from_user,
          to: data.to,
          subject: data.subject,
          text: "Congratulation.! You are Successfully Registered in Surgical Booking",
          html: data.body
      };
      if (maildata.attachments)
          mail.attachments = maildata.attachments;
      Transport.sendMail(mail, function(error, response) {
          if (error) {
              console.log(error);
              // console.log('kjaaaaaa');
          } else {
              console.log('Mail sent to ---------------' + mail.to);
          }
          Transport.close();
      });

  } catch (e) {
      console.log('Error in mail sending.............');
      console.log(e);
  }

}




/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('login');
});

 router.get('/myprofile', function (req, res, next) {
  var s = req.session.user_id
  console.log(s);
  mongoose.model('signup').find({ _id:s })
    .then((newSignupObj) => {
      console.log(newSignupObj);
      if (newSignupObj.length > 0) {
        res.render('dashboard',{newSignupObj:newSignupObj});

      }
    })
  });

  router.get('/accounts', function (req, res, next) {
    mongoose.model('signup').find()
      .then((newSignupObj) => {
        console.log(newSignupObj);
        if (newSignupObj.length > 0) {
          res.render('Accounts',{newSignupObj:newSignupObj});
  
        }
      })
    });
   //res.render('dashboard');

router.post('/page', function (req, res, next) {
  var reqs = req.body;
  // console.log(reqs);
  mongoose.model('signup').find({ email: reqs.email, password: reqs.password })
    .then((newSignupObj) => {
      console.log(newSignupObj);
      if (newSignupObj.length > 0) {

        req.session.user_id = newSignupObj[0]._id;
        req.session.email_id = newSignupObj[0].email;
        console.log('_id======' + req.session.user_id);
        console.log('_id======' + req.session.email_id);
        console.log({ status: 1, massage: 'Success' });
      res.redirect('/myprofile');
      } else {
        res.json({ status: 2, massage: 'Failure' });
      }

    })
});

router.get('/employee', function (req, res, next) {
  res.render('employee');
});

router.get('/signup', function (req, res, next) {
  res.render('signup');
});

/* Post Student Data */
router.post('/submit',  function (req, res, next) {
  try {
    var reqs = req.body;
    var newsignup = {
      surname:reqs.surname,
      firstname:reqs.firstname,
      lastname:reqs.lastname,
      email:reqs.email,
      password:reqs.password,
      mobile_number:reqs.mobile_number,
      status:1
    }
    mongoose.model('signup').create(newsignup, function (err, dataObj) {
      if (err) {
        console.log(err);
        res.json({ data: 'Failure' });
      } else {
        if (dataObj) {
          console.log(dataObj);
          // res.json(newStudentObj);
          res.render('login');
        } else {
          res.json({ data: 'Failure' });
          console.log('Object Failure');
        }
      }
    });
  }
  catch (e) {
    console.log(e);
  }
});


router.get('/employeelist', function (req, res, next) {
  try {
    mongoose.model('employee').find({ status: 1 }, function (err, employObj) {
      if (err) {
        console.log(err);
      } else {
        if (employObj) {
          res.render('employeelist', { dataObj: employObj });
        }
      }
    });
  } catch (e) {
    console.log();
  }
});

router.post('/employeedata', /*isAuthenticated,*/ function (req, res, next) {
  try {
    var reqs = req.body;
    console.log(reqs);
    var newemployee = {
      typeofemployee: reqs.typeofemployee,
      ename: reqs.ename,
      email: reqs.email,
      ecellno: reqs.ecellno,
      epassword: reqs.epassword,
      status: 1
    }
    if (reqs.employ_id != '') {
      console.log(reqs.employ_id);
      mongoose.model('employee').findOneAndUpdate({ _id: reqs.employ_id }, {
        $set: {
          typeofemployee: reqs.typeofemployee,
          ename: reqs.ename,
          email: reqs.email,
          ecellno: reqs.ecellno,
          epassword: reqs.epassword,
          status: 1,
          modify_date: new Date()
        }
      }, (err, updateEmpObj) => {
        if (err) {
          console.log(err);
          res.json({ data: 'Failure' });
        } else {
          if (updateEmpObj) {
            res.redirect('employeelist');
          } else {
            res.json({ data: 'Failure' });
          }
        }
      });
    } else {
      mongoose.model('employee').create(newemployee, function (err, dataObj) {
        if (err) {
          console.log(err);
          res.json({ data: 'Failure' });
        } else {
          if (dataObj) {
            res.redirect('employeelist');
          } else {
            res.json({ data: 'Failure' });
            console.log('Object Failure');
          }
        }
      });
    }
  }
  catch (e) {
    console.log(e);
  }
});

router.get('/employeeView/:dataId', /*isAuthenticated,*/ function (req, res, next) {
  dataId = req.params.dataId;

  mongoose.model('employee').findById({ "_id": dataId }, function (err, employObj) {
    if (err) {
      console.log(err);
      res.json({ data: 'Failure' });
    } else {
      if (employObj) {
        var maildata = {
          from_id: 0,
          to_id: 0,
          to_email: 'srikanthkk3077@gmail.com',
          template: 'your win dream11 in 100000 chack in your rank',
          subject: 'dream11',
          //attachments: [{ 'filename': fname, 'content': data }]
      };
      send_mailing(maildata);
        // res.json(dataObj);
        res.render('employeeView', { dataObj: employObj });
      } else {
        res.json({ data: 'Failure' });
        console.log('Object Failure');
      }
    }
  });
});

router.get('/employeeEdit/:dataId', /*isAuthenticated,*/ function (req, res, next) {
  dataId = req.params.dataId;

  mongoose.model('employee').findById({ "_id": dataId }, function (err, employObj) {
    if (err) {
      console.log(err);
      res.json({ data: 'Failure' });
    } else {
      if (employObj) {
        res.render('employeeEdit', { dataObj: employObj });
      } else {
        res.json({ data: 'Failure' });
        console.log('Object Failure');
      }
    }
  });
});



// //DELETE
// router.get('/delete/:id', (req, res) => {
//   try {
//     var dataId = req.params.id;
//     console.log(dataId);
//     mongoose.model('employee').remove({ _id: dataId }, (err, dataObj) => {
//       if (err) {
//         console.log(err);
//       } else {
//         res.redirect('/employeelist');
//       }
//     });
//   }
//   catch (e) {
//     console.log();
//   }
// });


//DELETE//
router.get('/delete/:dataId', (req, res) => {
  try {
    var user_id = req.params.dataId;
    console.log(user_id);
    mongoose.model('employee').findOneAndUpdate({ _id: user_id }, { $set: { status: 0 } }, (err, dataObj) => {
      if (err) {
        console.log(err);
      } else {
        if (dataObj) {
          res.redirect('/employeelist');
        } else {
          res.json({ data: 'Failure' });
          console.log('Object Failure');
        }
      }
    });
  }
  catch (e) {
    console.log();
  }
});

router.get('/logout', function (req, res) {
  res.clearCookie('x_access_token');
  res.cookie('auth', false);
  res.redirect('/')
});

module.exports = router;
