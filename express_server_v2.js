const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080
const cookieSession = require("cookie-session");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");

const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';

//Database/////

const databaseURLs = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

const users = {
  "jacky": {
    id: "jacky",
    userId: "jacky",
    email: "test@test.com",
    password: "test1234",
  }
};

////////////////

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(cookieParser());

app.use(cookieSession({
  name: "session",
  keys: ["key1", "key2"]
}));

//checks for logged in user
// app.use(function (req, res, next) {
//   let currentUser = req.session.user;
//   console.log("current:", currentUser)
//   //userId == undefined ? req.body.users = undefined : req.body.users = users.users[userId];
//   next();
// });



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


//Routes//////////
app.get("/", function (req, res) {
  // res.send("test");
  res.redirect("/urls")
});

app.get("/urls", function (req, res) {

  // res.send("Main page");
  let email = req.session.email;
  let templateVars = {email: req.body.email,
    urls: databaseURLs};
    console.log("temp:",templateVars);
  res.render("urls_index", templateVars)
});

app.post("/urls", function (req, res) {
  var shortURL = generateRandomString();
  var longURL = req.body.longURL;
  databaseURLs[shortURL] = longURL;
  res.redirect("/urls");
});

app.get("/urls/new", function (req, res) {
  res.render("urls_new");
});

app.get("/urls/:id", function (req, res) {
  // TODO
});

app.get("/u/:id", function (req, res) {
  //TODO
});

app.post("/urls/:id", function (req, res) {
  // TODO
});

app.post("/urls/:id/delete", (req, res) => {
  delete databaseURLs[req.params.id];
  res.redirect('/urls');
});

app.get("/login", function (req, res) {
  // res.send("Login");
});

app.get("/register", function (req, res) {
  res.render("urls_register");
});

app.post("/register", function (req, res) {
  let userRandomId = generateRandomString();
  let user = {
    id: userRandomId,
    email: req.body.email,
    password: req.body.password
  };

  if (!user["email"] || !user["password"]) {
    res.status(400).send("Please enter a email and password.");
    return;
  }

  for(var userId in users) {
    if (users[userId].email === req.body.email) {
      res.status(400).send("Email not available.");
      return;
    }
  };

  users[userRandomId] = user;
  console.log("user:",user);
  console.log(users);
  res.redirect("/")
});

app.post("/login", function (req, res) {
  //TODO
});

app.post("/logout", function (req, res) {
  //TODO
});

/////////////////



app.listen(8080)
