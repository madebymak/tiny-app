const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080
const cookieSession = require("cookie-session");
const bodyParser = require("body-parser");
// const bcrypt = require("bcrypt");
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
app.set("trust proxy", 1);
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
  let templateVars = {email: req.session.email,
    urls: databaseURLs};
  res.render("urls_index", templateVars);
  // res.send("test");
  // console.log('Cookies: ', req.cookies)
  // res.redirect("/urls")
});

app.get("/urls", function (req, res) {

  // res.send("Main page");
  // let email = req.session.email;
  let templateVars = {email: req.session["email"],
    urls: databaseURLs};
    // console.log("temp:",templateVars);
  res.render("urls_index", templateVars)
});

app.post("/urls", function (req, res) {
  var shortURL = generateRandomString();
  var longURL = req.body.longURL;
  databaseURLs[shortURL] = longURL;
  res.redirect("/urls");
});

app.get("/urls/new", function (req, res) {
  let templateVars = { email: req.session["email"]};
  res.render("urls_new", templateVars);
  // res.render("urls_new");
});

app.get("/urls/:id", function (req, res) {
  let templateVars = { email: req.session["email"], shortURL: req.params.id, longURL: databaseURLs[req.params.id]};
  // console.log("id:", templateVars)
  res.render("urls_show", templateVars);
});

app.post("/urls/:id", function (req, res) {
  databaseURLs[req.params.id].newURL = req.body.newURL;
  res.redirect('/urls');
});

app.post("/urls/:id/delete", (req, res) => {
  delete databaseURLs[req.params.id];
  res.redirect('/urls');
});

app.get("/login", function (req, res) {
  res.render("urls_login")
});

app.get("/register", function (req, res) {
  res.render("urls_register");
});

app.post("/register", function (req, res) {

  var unavailableEmail;

   Object.keys(users).forEach((userId) => {
     if (users[userId].email === req.body.email) {
       console.log(users[userId].email);
       unavailableEmail = users[userId].email;
     }
   });


  if (!req.body.email || !req.body.password) {
    res.status(400).send("Please enter a email and password.");
    return;
  }

  for(var userId in users) {
    if (unavailableEmail === req.body.email) {
      res.status(400).send("Email not available.");
      return;
    }
  };

   let enteredEmail = req.body.email;
   let enteredPassword = req.body.password;

  let randomUserId = generateRandomString();
  // console.log(users);

  // bcrypt.hash(enteredPassword, saltRounds, (err, hash) => {
    const newUser = { email: enteredEmail, password: enteredPassword }; //hash
    // console.log(hash);
    console.log(newUser);
    users[randomUserId] = newUser;
    console.log(users);
    // });

  res.redirect("/urls");
});

app.post("/login", function (req, res) {
  const emailInput = req.body.email;
  const passwordInput = req.body.password;

  console.log("email in:", emailInput)

  console.log("pass in:", passwordInput);

  var emailMatch;
  var passwordMatch;

  Object.keys(users).forEach((userId) => {
      console.log("users:", users[userId].email);
      console.log("usersdb pass:",users[userId].password);

     if (users[userId].email === emailInput) {
       emailMatch = users[userId].email;
       passwordMatch = users[userId].password;

     }
   });

   if (emailInput === emailMatch) {
     console.log("email found in the db");
   }
     // bcrypt.compare(passwordInput, passwordMatch, (err, pass) => {
  if (passwordInput === passwordMatch) {
      console.log("password matches, good to go");
      req.session.email = req.body.email;
      res.redirect("/urls");
      return;
    } else {
       console.log("wrong password");
       // res.send(nvalid email or password");
       res.status(403).send("Invalid email or password");
       return;
     }
   // });
     console.log("email not found");
     res.status(403).send("Invalid email or password");
     return;
})

app.post("/logout", function (req, res) {
  req.session.email = undefined;
  res.redirect("/login");
});

/////////////////



app.listen(8080)
