var express = require('express');
var router = express.Router();
const dbLib = require("../dbLib");

/* GET home page. */
router.get('/', function(req, res, next) {
  dbLib.getConnection(function(err, mclient) {
    if (err) throw err;
    //query for club gear table
    mclient.query("SELECT * FROM gear", (err, gearResult, fields) => {
      if (err) throw err;
      //query for ticket table
      mclient.query("SELECT * FROM tickets WHERE date_in IS NULL ORDER BY date_out", (err, ticketResult, fields) => {
        if (err) throw err;
        res.render('index',
          { title: 'Home',
            allGear: gearResult,
            tickets: ticketResult });
      });
    });   
  });
});

/* GET borrow page. */
router.get('/borrow', function(req, res, next) {
  dbLib.getConnection(function(err, mclient) {
    if (err) throw err;
    //query for club gear table
    mclient.query("SELECT * FROM gear", (err, gearResult, fields) => {
      if (err) throw err;
      res.render('borrow',
      { title: 'Borrow',
        allGear: gearResult});
    });   
  });
});

/* POST borrow page */
router.post('/borrow', function(req, res, next) {
  // body consists of tuples: (key, req.body[key]), where key=gear_id, value=quantity
  // I EVENTURALLY NEED TO ADD MORE FIELDS TO THIS TUPLE: date_out, destination, also need to get user somehow

  let rows = ""
  const arr = Object.keys(req.body)
  arr.forEach( (gear_id, index) => {

    const quantity = req.body[gear_id]
    const date_out = "'5999-01-30'"
    const destination = "'Yosemite'"

    if (quantity !== "0"){
      console.log("logging pairs w/ nonzero quantities:", gear_id, quantity);
      rows += `(NULL, ${gear_id}, 'wdiebolt', ${quantity}, ${date_out}, NULL, ${destination})`;
      rows += (index == arr.length-1 ? ";" : ",") //adds seperators orelse terminator
      console.log(index, arr.length)
    }


  });
  console.log(rows);

  dbLib.getConnection(function(err, mclient) {
    //create new tickets
    mclient.query(`INSERT INTO tickets VALUES ${rows}`, (err, ticketResult, fields) => {
      if (err) throw err;
      res.redirect('/');
    });
    
  });
});

/* GET return page. */
router.get('/return', function(req, res, next) {
  dbLib.getConnection(function(err, mclient) {
    //query for ticket table
    mclient.query("SELECT * FROM tickets WHERE date_in IS NULL ORDER BY date_out", (err, ticketResult, fields) => {
      if (err) throw err;
      res.render('return',
        { title: 'Return',
          tickets: ticketResult });
    });
    
  });
});


module.exports = router;
