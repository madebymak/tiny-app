const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080
const cookieSession = require("cookie-session");
const bodyParser = require("body-parser");

//Database/////
const databaseURLs = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

const databaseUsers = {
  "jacky": {
    id: "jacky",
    email: "test@test.com",
    password: "test1234",
  }
};

////////////////

app.set('view engine', "ejs");

app.listen(8080)
