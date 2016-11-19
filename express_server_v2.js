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

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({
  extended: true
}));

//Routes//////////

app.get('/', function (req, res) {
  res.redirect("/login")
});

app.get('/urls', function (req, res) {
  //TODO
});

app.get('/urls/new', function (req, res) {
  // TODO
});

app.get('/urls/:id', function (req, res) {
  // TODO
});

app.get('/u/:id', function (req, res) {
  //TODO
});

app.post('/urls', function (req, res) {
  // TODO
});

app.post('/urls/:id', function (req, res) {
  // TODO
});

app.get('/login', function (req, res) {
  res.send("Login")
});

app.get('/register', function (req, res) {
  // TODO
});

app.post('/register', function (req, res) {
  // TODO
});

app.post('/login', function (req, res) {
  //TODO
});

app.post('/logout', function (req, res) {
  //TODO
});

/////////////////



//Functions///////

function generateRandomString() {
  let list = "abcdefghijklmnopqrstuvwxyz0123456789";
  let newURL = "";

  for (var i = 0; i < 6; i++) {
    newURL += list.charAt(Math.floor(Math.random() * list.length));
  }
  return newURL;
}

//////////////////



app.listen(8080)
