var express = require('express'),
  app = express(),
  bodyParser = require('body-parser');

const  PORT = process.env.PORT || 3000;

app.use(function(req, res, next){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./route'); 
routes(app); 

app.listen(PORT);

console.log("Pointage - Server start ! " + PORT);
