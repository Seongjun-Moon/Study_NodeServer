const express = require("express");
const router = express.Router();
const mysql = require("../../config/database.js");
const con = mysql.init();
mysql.connect(con);

router.post("/join", (req, res) => {
  const name = req.body.name;
  const brth = req.body.brth;
  const frgn = req.body.frgn;
  const ci = req.body.ci;
  const memId = req.body.memId;
  const email = req.body.email;
  const pw = req.body.pw;
  var sql = "SELECT cust_no FROM MEMBER_CUST WHERE NAME = ? AND CI = ?";
  con.query(sql, [name, ci], function (err, result){
    if (result.length < 1) {
      // 만약 cust테이블에 등록된 데이터가 없다면 데이터 insert
      sql =
        "INSERT INTO member_cust (name, brth, foreigne, ci, reg_dtm) VALUES (?, ?, ?, ?, now())";
      con.query(sql, [name, brth, frgn, ci], function (err, result) {
        if (err) {
          console.log(err);
          res.send({
            "resultCd" : "9999",
            "resultMsg" : "server error"
          });
        } else {
          // member테이블에 데이터 insert
          insertMember(result.insertId, memId, email, pw, res); 
        }
      });
    } else {
      // cust테이블에 데이터가 있을경우 바로 member테이블에 데이터 insert
      insertMember(result[0].cust_no, memId, email, pw, res);
    }
  });
});

module.exports = router;

function insertMember(custNo, memId, email, pw, res){
  var sql = "SELECT 1 FROM MEMBER WHERE MEM_ID = ? AND STATUS = '00'";
  con.query(sql, [memId], function(err,result){
    if(err) {
      console.log(err);
      res.send({
        "resultCd" : "9999",
        "resultMsg" : "server error"
      });
    } else {
      // member테이블에 데이터가 없다면 회원가입
      if(result.length < 1){
        sql = "INSERT INTO member (cust_no, status, join_date, mem_id, mem_email, mem_pwd) VALUES(?, ?, NOW(), ?, ?, ?)";
        con.query(sql, [custNo, "00", memId, email, pw], function (err, result) {
          if (err) {
            console.log(err);
            res.send({
              "resultCd" : "9999",
              "resultMsg" : "server error"
            }); 
          } else {
            res.send({
              "resultCd" : "0000",
              "resultMsg" : "회원가입을 성공하였습니다."
            });
          }
        });
      } else {
        // member테이블에 데이터가 있다면 가입된회원 메세지 전달
        res.send({
          "resultCd" : "0011",
          "resultMsg" : "이미 등록된 회원입니다."
        });
      }
    }
  });
}