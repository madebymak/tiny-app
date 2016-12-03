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
  "b2xVn2": {
    user: "test@test.com",
    longURL: "http://www.lighthouselabs.ca"
  },
  "9sm5xK": {
    user: "test@test.com",
    longURL: "http://www.google.com"
  },
};

const users = {
  "jacky": {
    email: 'test@test.com',
    password: '$2a$10$HoTVuJEWsGWq8hw6NYNZQ.V8Tf6pDTc9VaR4vY/kykBeu9lPb2JPK'
  }
};

////////////////

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

app.use((req, res, next) => {
   res.locals.email = users[req.session.userSessId] ? req.session.email : null;
   res.locals.urls = databaseURLs;
   next();
 });

app.set('view engine', 'ejs');

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
  // let templateVars = {
  //   email: req.session.email,
  //   urls: databaseURLs
  // };
  // res.render("urls_index", templateVars);
  res.render("urls_index");
  // res.send("test");
  // console.log('Cookies: ', req.cookies)
  // res.redirect("/urls")
});

app.get("/urls", function (req, res) {
  // let email = req.session.email;
  // let templateVars = {
  //   email: req.session["email"],
  //   urls: databaseURLs
  // };
    // console.log("temp:",templateVars);
  // res.render("urls_index", templateVars)
  res.render("urls_index")
});

app.post("/urls", function (req, res) {
  var email = req.session.email;
  // console.log("email:", email);
  var shortURL = generateRandomString();
  var newLongURL = req.body.longURL
  // var longURL = req.body.longURL;
  databaseURLs[shortURL] = {
    user: email,
    longURL: newLongURL
  };
  console.log("data", databaseURLs);
  res.redirect("/urls");
});

app.get("/urls/new", function (req, res) {
  // let templateVars = {
  //   email: req.session["email"]
  // };
  // res.render("urls_new", templateVars);
  res.render("urls_new");
});

app.get("/urls/:id", function (req, res) {
   console.log("req body:",req.params.id);
  let templateVars = {
    email: req.session.email,
    urls: databaseURLs,
    paramId: req.params.id,
    // shortURL: req.params.id,
    // longURL: databaseURLs[req.params.id]
  };
  // console.log(templateVars)
  // console.log("id:", templateVars)
  res.render("urls_show", templateVars);
});

app.post("/urls/:id", function (req, res) {
  let newLongURL = req.body.newURL;
   // databaseURLs[req.params.id].longURL = newLongURL;
  databaseURLs[req.params.id].longURL = newLongURL;
  // console.log("new url:", databaseURLs[req.params.id]);
  // console.log("req body url:", req.body.newURL);
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
       // console.log(users[userId].email);
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
  console.log(users);

  bcrypt.hash(enteredPassword, saltRounds, (err, hash) => {
    const newUser = {
      user: randomUserId,
      email: enteredEmail,
      password: hash
      // password: enteredPassword
    };
    console.log("hash:",hash);
    console.log("newuser:",newUser);
    // console.log(newUser);
    users[randomUserId] = newUser;
    console.log("newUser db:", users);
    });
  console.log("users db:", users);
  res.redirect("/urls");
});

app.post("/login", function (req, res) {
  const emailInput = req.body.email;
  const passwordInput = req.body.password;

  // console.log("email in:", emailInput)

  // console.log("pass in:", passwordInput);

  var emailMatch;
  var passwordMatch;
  var userUniq;

  Object.keys(users).forEach((userId) => {
      // console.log("users:", users[userId].email);
      // console.log("usersdb pass:",users[userId].password);

     if (users[userId].email === emailInput) {
       emailMatch = users[userId].email;
       passwordMatch = users[userId].password;
       userUniq = userId;

     }
   });

   if (emailInput === emailMatch) {
     console.log("email found in the db");
     console.log("email:", emailMatch);
    console.log("pass input:" ,passwordInput);
    console.log("pass:", passwordMatch);
   bcrypt.compare(passwordInput, passwordMatch, (err, passwordFound) => {
     if (passwordFound) {
      console.log("password matches, good to go");
      req.session.userSessId = userUniq;
      req.session.email = req.body.email;
      res.redirect("/urls");
      return;
    } else {
       console.log("wrong password");
       // res.send(nvalid email or password");
       res.status(403).send("Invalid email or password");
       return;
     }
   })
 } else {
     console.log("email not found");
     res.status(403).send("Invalid email or password");
     return;
   }
});

app.post("/logout", function (req, res) {
  req.session.email = undefined;
  req.session.userSessId = undefined;
  res.redirect("/urls");
});

/////////////////

app.listen(8080);
