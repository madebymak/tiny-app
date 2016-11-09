var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080; // default port 8080

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}))

app.set("view engine", "ejs");


var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",

};

app.get("/", (req, res) => {
  res.end("Hello!");
});

app.post("/urls", (req, res) => {
  var shortURL = generateRandomString(); //generates random string
  var longURL = req.body.longURL; //sets key-values pairs from bodyparse
  urlDatabase[shortURL] = longURL; //sets longURL to urlDatabase[shortURL]
  res.redirect(`/urls/${shortURL}`); //redirects
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.post("/urls/:id/delete", (req, res) => {
  res.redirect('/urls');
})

app.post("/urls", (req, res) => {
  console.log(req.body);
  res.send("Ok");
});

app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL:req.params.id, longURL: urlDatabase[req.params.id]}; //here
  res.render("urls_show", templateVars);
});

app.get("/urls", (req, res) => {
  let templateVars = {urls: urlDatabase};
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




