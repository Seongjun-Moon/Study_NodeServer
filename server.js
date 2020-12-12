const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");

const movieSearchRouter = require("./routers/movie/movieRouter");
const memberJoinRouter = require("./routers/member/memberJoinRouter");
const memberLoginRouter = require("./routers/member/memberLoginRouter");

const corsOptions = {
  origin: true,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/movie", movieSearchRouter);
app.use("/member", memberLoginRouter);
app.use("/member", memberJoinRouter);

app.listen(7777, () => {
  console.log("server ready..");
});
