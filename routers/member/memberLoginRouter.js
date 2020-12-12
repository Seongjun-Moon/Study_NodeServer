const express = require("express");
const router = express.Router();
const mysql = require("../../config/database.js");
const con = mysql.init();
mysql.connect(con);

router.post("/login", (req, res) => {
  console.log(req.body);
  var memId = req.body.memId;
  var pw = req.body.memPw;
  var status = "00";
  var sql = "SELECT * FROM member WHERE mem_Id = ? and status = ?";
  con.query(sql, [memId, status], function (err, result) {
    console.log(result);
    if (err) {
      console.log(err);
      res.json({ message: false });
    } else {
      if (result.length > 0){
        if (result[0].mem_pwd == pw){
          res.send({
            "resultCd" : "0000",
            "resultMsg" : "로그인에 성공하였습니다."
          });
        } else {
          res.send({
            "resultCd" : "0009",
            "resultMsg" : "아이디 혹은 비밀번호가 일치하지 않습니다."
          });
        }
      } else {
        res.send({
          "resultCd" : "9999",
          "resultMsg" : "아이디가 존재하지 않습니다."
        });
      }
    }
    console.log(result);
  });
});

module.exports = router;
