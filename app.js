const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const userRoutes = require("./routes/user");
const sauceRoutes = require("./routes/sauce");
const path = require("path");

module.exports = app;

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(bodyParser.json());

mongoose
  .connect(
    "mongodb+srv://juanjosearriaza:CQsFnxZQRunmxhHW@cluster0-m2dnq.mongodb.net/test?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Successfully connected to Mongo DB Atlas¡");
  })
  .catch((error) => {
    console.error(error);
  });

app.use("/api/sauces", sauceRoutes);
app.use("/api/auth", userRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));
