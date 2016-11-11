var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080; // default port 8080

const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');

app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser())

app.set("view engine", "ejs");

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",

};

let emptyObj = {};

app.get("/", (req, res) => {
  res.redirect("/urls")
});

app.post("/urls", (req, res) => {
  var shortURL = generateRandomString(); //generates random string
  var longURL = req.body.longURL; //sets key-values pairs from bodyparse
  urlDatabase[shortURL] = longURL; //sets longURL to urlDatabase[shortURL]
  res.redirect(`/urls/${shortURL}`); //redirects
});

// app.get("/login", (req, res) => {
//   res.send("login");
// });


app.post("/login", (req, res) => {
  res.cookie("username", req.body.username);
  res.redirect('/urls');
});

app.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect("/");
});

//user registration

app.post("/register", (req, res) => {
  let userRandomID = generateRandomString();
  let user = {id: userRandomID,  email: req.body.email, password: req.body.password};
  emptyObj[userRandomID] = user;
  console.log(emptyObj);

  if (!user["email"] || !user["password"]) {
    //console.log("Problem");
    res.status(400).send("Please enter email and password.");
    return;
  }
    Object.keys(emptyObj).forEach((userId) => {
   if (emptyObj[userId].email === req.body.email) {
     res.status(400).send("Email not available.");
     return;
     //console.log("Not available.", res.statusCode);
   }
})
    res.cookie("key", userRandomID);
     res.redirect("/urls");

})

app.get("/register", (req, res) => {
  res.render("urls_register");
});

// app.get("/register", (req, res) => {
//   let templateVars = {user_id: req.cookies["id"]};
//   res.render("urls_register", templateVars);
// });

////////////////////////////////////////

app.get("/urls/new", (req, res) => {
  let templateVars = { username: req.cookies["username"]};
  res.render("urls_new", templateVars);
});

app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect('/urls');
});

app.get("/urls/:id", (req, res) => {
  let templateVars = { username: req.cookies["username"], shortURL: req.params.id, longURL: urlDatabase[req.params.id]};
  res.render("urls_show", templateVars);
});

app.post("/urls/:id", (req, res) => {
  urlDatabase[req.params.id] = req.body.newURL;
  res.redirect('/urls');
});

app.get("/urls", (req, res) => {
  let templateVars = {username: req.cookies["username"],
urls: urlDatabase};
  res.render("urls_index", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

function generateRandomString() {

  var list = "abcdefghijklmnopqrstuvwxyz0123456789";
  var newURL = "";

  for (var i = 0; i < 6; i++) {
    newURL += list.charAt(Math.floor(Math.random() * list.length));
  }
  return newURL;
}




