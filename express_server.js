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

//Routes//////////

app.get("/", function(req, res) {
  res.render("urls_index");
});

//Login///////////

app.get("/login", function(req, res) {
  res.render("urls_login");
});

app.post("/login", function(req, res) {
  const emailInput = req.body.email;
  const passwordInput = req.body.password;

  var emailMatch;
  var passwordMatch;
  var userUniq;

  Object.keys(users).forEach((userId) => {
    if (users[userId].email === emailInput) {
      emailMatch = users[userId].email;
      passwordMatch = users[userId].password;
      userUniq = userId;
    }
  });

  if (emailInput === emailMatch) {
    bcrypt.compare(passwordInput, passwordMatch, (err, passwordFound) => {
      if (passwordFound) {
        req.session.userSessId = userUniq;
        req.session.email = req.body.email;
        res.redirect("/urls");
        return;
      } else {
        res.render("error/401_error");
        return;
      }
    });
  } else {
    res.status(403);
    res.render("error/403_error");
    return;
  }
});

//Register////////////////////////

app.get("/register", function(req, res) {
  res.render("urls_register");
});

app.post("/register", function(req, res) {
  var unavailableEmail;

  Object.keys(users).forEach((userId) => {
    if (users[userId].email === req.body.email) {
      unavailableEmail = users[userId].email;
    }
  });

  if (!req.body.email || !req.body.password) {
    res.status(400);
    res.render("error/400_error");
    return;
  }

  for (var userId in users) {
    if (unavailableEmail === req.body.email) {
      res.status(400);
      res.render("error/400_error");
      return;
    }
  }

  let enteredEmail = req.body.email;
  let enteredPassword = req.body.password;

  let randomUserId = generateRandomString();

  bcrypt.hash(enteredPassword, saltRounds, (err, hash) => {
    const newUser = {
      user: randomUserId,
      email: enteredEmail,
      password: hash
    };
    users[randomUserId] = newUser;
  });
  res.redirect("/urls");
});

//urls//////////////////////////////////

app.get("/urls", function(req, res) {
  res.render("urls_index");
});

app.post("/urls", function(req, res) {
  var email = req.session.email;
  var shortURL = generateRandomString();
  var newLongURL = req.body.longURL.includes("http://" || "http://") ? req.body.longURL : ("http://" + req.body.longURL);
  databaseURLs[shortURL] = {
    user: email,
    longURL: newLongURL
  };
  res.redirect("/urls");
});

app.get("/urls/new", function(req, res) {
  res.render("urls_new");
});

app.get("/urls/:id", function(req, res) {
  if (!databaseURLs[req.params.id]) {
    res.status(404);
    res.render("error/404_error");
  } else if (req.session.email !== databaseURLs[req.params.id].user) {
    res.status(403);
    res.render("error/403_error");
  }
  let templateVars = {
    email: req.session.email,
    urls: databaseURLs,
    paramId: req.params.id,
  };
  res.render("urls_show", templateVars);
});

app.post("/urls/:id", function(req, res) {
  let newLongURL = req.body.newURL.includes("http://" || "http://") ? req.body.newURL : ("http://" + req.body.newURL);
  databaseURLs[req.params.id].longURL = newLongURL;
  res.redirect('/urls');
});

app.post("/urls/:id/delete", (req, res) => {
  if (req.session.email !== databaseURLs[req.params.id].user) {
    res.status(403);
    res.render("error/403_error");
  }
  delete databaseURLs[req.params.id];
  res.redirect('/urls');
});

app.get("/u/:id", (req, res) => {
  if (!databaseURLs[req.params.id]) {
    res.status(404);
    res.render("error/404_error");
  }
  let longURL = databaseURLs[req.params.id].longURL;
  res.redirect(longURL);
});

//Logout/////////////////////////////////

app.post("/logout", function(req, res) {
  req.session.email = undefined;
  req.session.userSessId = undefined;
  res.redirect("/");
});

////////////////////////////////////

app.listen(8080);
