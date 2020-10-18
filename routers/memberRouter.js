const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const con = mysql.createConnection({
  host: "localhost",
  user: "user",
  password: "1234",
  database: "node",
});

router.post("/insert", (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const pw = req.body.pw;
  const comments = req.body.comments;
  var sql =
    "INSERT INTO members (name, email, password, comments) VALUES (?, ?, ?, ?)";
  con.query(sql, [name, email, pw, comments], function (err, result) {
    if (err) {
      res.json({ message: false });
    } else {
      res.json({ message: name });
    }
    console.log("1 record inserted");
  });
});

router.post("/login", (req, res) => {
  console.log(req.body);
  var email = req.body.email;
  var pw = req.body.pw;
  var sql = "SELECT * FROM members WHERE email =? and password= ?";
  con.query(sql, [email, pw], function (err, result) {
    if (err) {
      res.json({ message: false });
    } else {
      req.session.email = email;
      res.json({ message: result[0].name });
    }
    console.log(result);
  });
});

module.exports = router;
