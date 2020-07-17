const express = require("express");
const path = require("path");
const fetch = require("node-fetch");
const app = express();
const PORT = process.env.PORT || 8080;
const apiKey = "df83c801c177f8ca6787e8b393c5d9ac";

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", 'http://localhost:3000');
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use("/static", express.static(path.join(__dirname, "public")));

app.get('/search/:city',  (req, res) => {
  const urlCity = `https://api.openweathermap.org/data/2.5/weather?q=${req.params.city}&appid=${apiKey}`;
  fetch(urlCity)
  .then(res => res.json())
  .then(data=>res.send(data));
});

 app.post('/nearby', (req, res) => {
  const urlNear = `https://api.openweathermap.org/data/2.5/onecall?lat=${req.body.lat}&lon=${req.body.long}&appid=${apiKey}`;
  fetch(urlNear)
  .then(res => res.json())
  .then(data=>res.send(data));
});

app.listen(PORT, () =>
  console.log(`Server started and listening on port ${PORT}`)
);

module.exports = app;
