const express = require("express");
const router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");
const mysql = require("mysql");
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "node",
});

router.post("/search", function (req, res, next) {
  const url2 = "http://www.cgv.co.kr/movies/";

  axios.get(url2).then((html) => {
    let ulList = [];
    let moviesList = [];

    const $ = cheerio.load(html.data);
    // const $bodyList = $("div.section01 ul.list").children("li");
    const $imgList = $("div.sect-movie-chart ol").children("li");
    const $movieList = $("div.sect-movie-chart li").children(
      "div.box-contents"
    );
    console.log($movieList);
    //const $summary = $("div.store-box").children("div.store-box__display-text");
    //each : list 마다 함수 실행, forEach와 동일
    $imgList.each(function (i, elem) {
      ulList[i] = {
        image_url: $(this).find("img").attr("src"),
        movie_url: $(this).find("a").attr("href"),
      };
    });
    $movieList.each(function (i, elem) {
      moviesList[i] = {
        movie: $(this).find("strong.title").text(),
      };
    });
    // $summary.each(function (i, elem) {
    //   summaryList[i] = {
    //     summary: $(this).text(),
    //   };
    // });

    const img_data = ulList.filter((n) => n.image_url);
    const movie_data = moviesList.filter((n) => n.movie);
    const movie = [img_data, movie_data];
    //const summary_data = summaryList.filter((n) => n.summary);
    //json으로 변환하여 app으로 전송

    return res.json({ img_data, movie_data, movie });
  });
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
