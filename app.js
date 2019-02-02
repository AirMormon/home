var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var port = 5000;
app.use(bodyParser.json());

const mongoURL = 'mongodb://localhost:27017/homepage'
//const mongoURL = 'mongodb://username:password1@ds233228.mlab.com:33228/homepage'
const mongoClient = require('mongodb').MongoClient;
const assert = require('assert')

mongoClient.connect(mongoURL, {
  useNewUrlParser: true
}, function (err, client) {
  assert.equal(null, err);
  console.log("connected")
  db = client.db("homepage")
})




app.use(express.static(__dirname + '/public')); //That's a double underscore

//the specific route handler below is not really needed anymore since by default express looks to server index.html
app.get('/', function (req, res) {
  res.sendFile('index.html');
});

app.post('/data', function (req, res) {
  var data = req.body;
  console.log(data)
  db.collection('dataSet').insertOne(data);
})

app.post('/del', function (req, res) {
  var data = req.body.item;
 
  db.collection('dataSet').deleteMany({
    "stuff": data
  });
})




app.get('/respo', function (req, res) {

  db.collection('dataSet').find({}).toArray(function (err, result) {
    if (err) {
      console.log(err)
    } else {
      res.send(result)
    }
  })

})

app.listen(port, function () {
  console.log('Great! The server is running and waiting for traffic on port 5000.')
});