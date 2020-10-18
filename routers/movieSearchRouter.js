const express = require("express");
const router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");
const mysql = require("mysql");
const con = mysql.createConnection({
  host: "localhost",
  user: "user",
  password: "1234",
  database: "node",
});

router.post("/search", function (req, res, next) {
  const url2 = "http://www.cgv.co.kr/movies";

  axios.get(url2).then((html) => {
    let ulList = [];
    let moviesList = [];

    const $ = cheerio.load(html.data);
    // const $bodyList = $("div.section01 ul.list").children("li");
    const $imgList = $("div.sect-movie-chart ol").children("li");
    const $movieList = $("div.sect-movie-chart li").children(
      "div.box-contents"
    );
    // console.log($movieList);
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
    // console.log(movie_data[0].movie);

    const send_param = {
      movie_name: movie_data[0].movie,
      // movie_url: url2 + img_data[0].movie_url,
    };
    // console.log(movie_data[0].movie);
    // for (let i = 0; i < movie_data.length; i++) {
    //   const send_param = {
    //     movie_name: movie_data[i].movie,
    //   };
    //   axios
    //     .post("http://localhost:7777/movieSearch/movie_search", send_param)
    //     .then((res) => {
    //       if (res.data.result.length != 0) {
    //         console.log("이미 존재하는 영화");
    //       } else {
    //         axios.post(
    //           "http://localhost:7777/movieSearch/movie_insert",
    //           send_param
    //         );
    //       }
    //     });
    //   console.log(i);
    // }
    axios
      .post("http://localhost:7777/movieSearch/movie_search", send_param)
      .then((res) => {
        console.log(res.data.result);
        if (res.data.result.length != 0) {
          console.log("이미 존재하는 영화");
        } else {
          axios.post(
            "http://localhost:7777/movieSearch/movie_insert",
            send_param
          );
        }
      });

    return res.json({ img_data, movie_data, movie });
  });
});
router.post("/movie_search", (req, res) => {
  const movie_nm = req.body.movie_name;
  var sql = "select * from movie_info where movie_nm = ?";
  con.query(sql, [movie_nm], function (err, result) {
    if (err) {
      res.json({ message: false });
    } else {
      res.json({ result: result });
      console.log(result);
      console.log("movie record find");
    }
  });
});

router.post("/movie_insert", (req, res) => {
  const movie_nm = req.body.movie_name;
  // const movie_url = req.body.movie_url;
  var sql = "insert into movie_info(movie_nm) values (?)";
  console.log(sql);
  con.query(sql, [movie_nm], function (err, result) {
    if (err) {
      res.json({ message: false });
    } else {
      res.json({ message: movie_nm });
      console.log("movie record inserted");
    }
  });
});

module.exports = router;
