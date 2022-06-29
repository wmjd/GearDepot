var express = require('express');
var router = express.Router();
const sql = require("../lib/sqlConn");
const passport = require('passport');
const genPassword = require('../lib/passwordUtils').genPassword;
const connection = require('../lib/mongooseConn');
const User = connection.models.User;
const isAuth = require('../lib/authMiddleware').isAuth;
const isAdmin = require('../lib/authMiddleware').isAdmin;

/* GET home page. */
router.get('/', isAuth, function(req, res, next) {
  sql.getConnection(function(err, mclient) {
    if (err) throw err;
    //query for club gear table
    mclient.query("SELECT * FROM gear", (err, gearResult, fields) => {
      if (err) throw err;
      //query for ticket table
      mclient.query("SELECT * FROM tickets WHERE date_in IS NULL AND date_out IS NOT NULL ORDER BY date_out", (err, ticketResult, fields) => {
        if (err) throw err;
        //console.log(ticketResult);
        res.render('index',
          { title: 'Home',
            allGear: gearResult,
            tickets: ticketResult });
      });
    });   
  });
});

/* GET borrow page. */
router.get('/borrow', isAuth, function(req, res, next) {
  sql.getConnection(function(err, mclient) {
    if (err) throw err;
    //query for club gear table
    mclient.query("SELECT * FROM gear", (err, gearResult, fields) => {
      if (err) throw err;
      mclient.query("SELECT * FROM tickets WHERE date_out IS NULL", (err, checkoutReqs, fields) => {
        if (err) throw err;
        res.render('borrow',
        { title: 'Borrow',
          allGear: gearResult,
          pending: checkoutReqs});
      })
    });   
  });
});

/* POST borrow page */
router.post('/borrow', isAuth, function(req, res, next) {
  // body consists of object with string key-value pairs per row of table where key=gear_id, value=<array of input>
  console.log('POST /borrow req.body: ', req.body)
  let rows = ""
  const nonZeroIDs = Object.keys(req.body).filter( id => req.body[id][0] !== "0" && req.body[id][1] !== "0")
  console.log(nonZeroIDs)
  console.log(nonZeroIDs.length)
  if(nonZeroIDs.length === 0)
    {res.redirect('/borrow')}
  else {
    nonZeroIDs.forEach( (gear_id, index) => {

      const quantity = req.body[gear_id][0]
      const destination = req.body[gear_id][1]
      console.log("logging pairs w/ nonzero quantities, dest:", gear_id, quantity, destination);
     
      rows += `(NULL, ${gear_id}, "${req.user.username}", ${quantity}, NULL, FALSE, NULL, "${destination}")`;
      rows += (index == nonZeroIDs.length-1 ? ";" : ",") //adds seperators orelse terminator
      //console.log(index, nonZeroIDs.length)
    });
    console.log(rows);
    sql.getConnection(function(err, mclient) {
      //create new tickets
      mclient.query(`INSERT INTO tickets VALUES ${rows}`, (err, ticketResult, fields) => {
        if (err) throw err;
        res.redirect('/borrow');
      });
    });
  }
});

router.post('/cancel-borrow-request', isAuth, function(req, res, next) {
  console.log("logging cancel borrow req body", req.body);
  const tix = Object.keys(req.body);
  let formattedIDs = "(";
  tix.forEach((ticket_id, index) => {
    formattedIDs += `'${ticket_id}'`;
    formattedIDs += (index == tix.length-1 ? ")" : ",");
  });
  const queryString = `DELETE FROM tickets WHERE ticket_id IN ${formattedIDs}`;
  sql.getConnection(function(err, mclient) {
    mclient.query(queryString, (err, ticketResult, fields) => {
      if (err) throw err;
      res.redirect('/borrow');
    });    
  });
});
router.post('/admin-cancel-borrow-request', isAuth, function(req, res, next) {
  console.log("logging cancel borrow req body", req.body);
  const tix = Object.keys(req.body);
  let formattedIDs = "(";
  tix.forEach((ticket_id, index) => {
    formattedIDs += `'${ticket_id}'`;
    formattedIDs += (index == tix.length-1 ? ")" : ",");
  });
  const queryString = `DELETE FROM tickets WHERE ticket_id IN ${formattedIDs}`;
  sql.getConnection(function(err, mclient) {
    mclient.query(queryString, (err, ticketResult, fields) => {
      if (err) throw err;
      res.redirect('/admin');
    });    
  });
});

/* GET return page. */
router.get('/return', isAuth, function(req, res, next) {
  sql.getConnection(function(err, mclient) {
    //query for ticket table
    //console.log("loggign req.user again", req.user)
    mclient.query(`SELECT * FROM tickets WHERE date_out IS NOT NULL AND return_req=False AND user_id="${req.user.username}"`, (err, tixOut, fields) => {
      if (err) throw err;
      mclient.query(`SELECT * FROM tickets WHERE date_in IS NULL AND return_req=True AND user_id="${req.user.username}"`, (err, tixPending, fields) => {
        if (err) throw err;
      res.render('return',
        { title: 'Return',
          tickets: tixOut,
          pending: tixPending});
      });
    })
  });
});

router.post('/return-request', isAuth, function(req, res, next) {
  console.log(req.body);
  const tix = Object.keys(req.body);
  let formattedIDs = "(";
  tix.forEach((ticket_id, index) => {
    formattedIDs += `'${ticket_id}'`;
    formattedIDs += (index == tix.length-1 ? ")" : ",");
  });
  const queryString = `UPDATE tickets SET return_req=True WHERE ticket_id IN ${formattedIDs}`;
  sql.getConnection(function(err, mclient) {
    mclient.query(queryString, (err, ticketResult, fields) => {
      if (err) throw err;
      res.redirect('/return');
    });    
  });
});
router.post('/cancel-return-request', isAuth, function(req, res, next) {
  console.log(req.body);
  const tix = Object.keys(req.body);
  let formattedIDs = "(";
  tix.forEach((ticket_id, index) => {
    formattedIDs += `'${ticket_id}'`;
    formattedIDs += (index == tix.length-1 ? ")" : ",");
  });
  const queryString = `UPDATE tickets SET return_req=False WHERE ticket_id IN ${formattedIDs}`;
  sql.getConnection(function(err, mclient) {
    mclient.query(queryString, (err, ticketResult, fields) => {
      if (err) throw err;
      res.redirect('/return');
    });    
  });
});
router.post('/admin-cancel-return-request', isAuth, function(req, res, next) {
  console.log(req.body);
  const tix = Object.keys(req.body);
  let formattedIDs = "(";
  tix.forEach((ticket_id, index) => {
    formattedIDs += `'${ticket_id}'`;
    formattedIDs += (index == tix.length-1 ? ")" : ",");
  });
  const queryString = `UPDATE tickets SET return_req=False WHERE ticket_id IN ${formattedIDs}`;
  sql.getConnection(function(err, mclient) {
    mclient.query(queryString, (err, ticketResult, fields) => {
      if (err) throw err;
      res.redirect('/admin');
    });    
  });
});

// admin routes 
router.get('/admin', isAdmin, function(req, res, next) {
  sql.getConnection(function(err, mclient) {
    if (err) throw err;
    //get all of the borrow/checkout request tickets
    mclient.query("SELECT * FROM tickets WHERE date_out IS NULL", (err, checkoutReqs, fields) => {
      //checkoutReqs is an array of tickets which is JS object 
      if (err) throw err;
      //console.log(checkoutReqs);
      mclient.query("SELECT * FROM tickets WHERE date_in IS NULL AND return_req=True", (err, checkinReqs, fields) => {
        if (err) throw err;
        res.render('admin',{ title: "Admin", checkin: checkinReqs, checkout: checkoutReqs});
      });
    })     
  })
});

router.post('/admin-checkin', isAdmin, (req, res, next) => {
  const tickets = Object.keys(req.body);
  let formattedIDs = "(";
  tickets.forEach( (ticket_id, index) => {
    formattedIDs += `'${ticket_id}'`;
    formattedIDs += (index == tickets.length-1 ? ")" : ",");
  });
  console.log(formattedIDs);
  const d = new Date();
  const year = d.getFullYear();
  const month = d.getMonth();
  const day = d.getDate();
  const date_in = `'${year}-${month+1}-${day}'`;
  const queryString = `UPDATE tickets SET date_in=${date_in} WHERE ticket_id IN ${formattedIDs}`;
  sql.getConnection(function(err, mclient) {
    mclient.query(queryString, (err, ticketResult, fields) => {
      if (err) throw err;
      res.redirect('/admin');
    });    
  });
});

router.post('/admin-checkout', isAdmin, (req, res, next) => {
  console.log("/admin-checkout hit; logging req.body:",req.body)
  
  const tickets = Object.keys(req.body);
  let formattedIDs = "(";
  tickets.forEach( (ticket_id, index) => {
    formattedIDs += `'${ticket_id}'`;
    formattedIDs += (index == tickets.length-1 ? ")" : ",");
  });
  console.log(formattedIDs);
  const d = new Date();
  const year = d.getFullYear();
  const month = d.getMonth();
  const day = d.getDate();
  const date_out = `'${year}-${month+1}-${day}'`;
  const queryString = `UPDATE tickets SET date_out=${date_out} WHERE ticket_id IN ${formattedIDs}`;
  sql.getConnection(function(err, mclient) {
    mclient.query(queryString, (err, ticketResult, fields) => {
      if (err) throw err;
      res.redirect('/admin');
    });    
  });
});


// post auth routes
router.post('/login', passport.authenticate('local', { failureRedirect: '/login', successRedirect: '/' }));

router.post('/register', (req, res, next) => {
   const saltHash = genPassword(req.body.pw);
   
   const salt = saltHash.salt;
   const hash = saltHash.hash;

   const newUser = new User({
       username: req.body.uname,
       hash: hash,
       salt: salt,
       admin: true
   });

   newUser.save()
       .then((user) => {
           console.log(user);
       });

   res.redirect('/login');
});

// get auth routes
router.get('/login', function(req, res, next) {
  res.render('login');
})

router.get('/register', (req, res, next) => {
  res.render('register');
});

router.get('/logout', function(req, res, next) {
  req.logout((err) => {if (err) {return next(err)} else res.redirect('/login');});
});

module.exports = router;
