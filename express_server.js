var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080; // default port 8080

const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');

app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser())

app.set("view engine", "ejs");


///Database////////////////
var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",

};

let usersObj = { "jacky":
{id: "jacky",
email: "test@test.com",
password: "test1234"}
};

/////////////////////////////


app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/", (req, res) => {
  res.redirect("/urls")
});

//login////////////////////
app.get("/login", (req, res) => {
  //res.send("login");
  res.render("/login")
});

//made changes
app.post("/login", (req, res) => {
  //if !email, return 403
  //if password  !== saved password, return 403
  //if email && password, set user_id cookie
  // req.cookies.user
  res.redirect('/urls');
});

app.post("/logout", (req, res) => {
  res.clearCookie("email");
  res.redirect("/");
});
///////////////////////

//user registration////////////

app.get("/register", (req, res) => {
  res.render("urls_register");
});

app.post("/register", (req, res) => {
  let userRandomID = generateRandomString();
  let user = {id: userRandomID, email: req.body.email, password: req.body.password};

  if (!user["email"] || !user["password"]) {
    res.status(400).send("Please enter a email and password.");
    return;
  }

  for(var userId in usersObj) {
    if (usersObj[userId].email === req.body.email) {
      res.status(400).send("Email not available.");
      return;
    }
  };

  usersObj[userRandomID] = user;
  //console.log("User list:", usersObj);
  res.cookie("key", userRandomID);
  res.redirect("/urls");

})

////////////////////////////////////////



app.get("/urls", (req, res) => {
//   let templateVars = { email: req.cookies["email"],
// urls: urlDatabase};
  // res.render("urls_index", templateVars);
  res.render("urls_index");
});

app.post("/urls", (req, res) => {
  let email = req.cookie.usersObj["email"];
  var shortURL = generateRandomString(); //generates random string
  var longURL = req.body.longURL; //sets key-values pairs from bodyparse
  urlDatabase[shortURL] = longURL; //sets longURL to urlDatabase[shortURL]
  res.redirect(`/urls/${shortURL}`); //redirects
});



app.get("/urls/new", (req, res) => {
  // let templateVars = { email: req.cookies["email"]};
  // res.render("urls_new", templateVars);
  res.render("urls_new");
});

app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect('/urls');
});

app.get("/urls/:id", (req, res) => {
  let templateVars = { email: req.cookies["email"], shortURL: req.params.id, longURL: urlDatabase[req.params.id]};
  res.render("urls_show", templateVars);
});

app.post("/urls/:id", (req, res) => {
  urlDatabase[req.params.id] = req.body.newURL;
  res.redirect('/urls');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


//Functions//////////////////////

function generateRandomString() {

  var list = "abcdefghijklmnopqrstuvwxyz0123456789";
  var newURL = "";

  for (var i = 0; i < 6; i++) {
    newURL += list.charAt(Math.floor(Math.random() * list.length));
  }
  return newURL;
}

//////////////////////////////////

