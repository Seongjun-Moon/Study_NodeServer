const express = require("express");
const router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");

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
    //const summary_data = summaryList.filter((n) => n.summary);
    //json으로 변환하여 app으로 전송
    return res.json({ img_data, movie_data });
  });
});

module.exports = router;
