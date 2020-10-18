const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");

const movieSearchRouter = require("./routers/movieSearchRouter");
const memberhRouter = require("./routers/memberRouter");

const corsOptions = {
  origin: true,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/movieSearch", movieSearchRouter);
app.use("/member", memberhRouter);

app.listen(7777, () => {
  console.log("server ready..");
});
