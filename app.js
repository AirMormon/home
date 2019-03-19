var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var port = 5000;
app.use(bodyParser.json());
const rp = require('request-promise')
//const mongoURL = 'mongodb://localhost:27017/homepage'
const mongoURL = 'mongodb://username:password1@ds233228.mlab.com:33228/homepage'
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


app.get('/nba', function (req, res) {
  var array = []

  request('https://www.rotowire.com/basketball/nba-lineups.php', (error, response, html) => {

    if (!error && response.statusCode == 200) {
      const $ = cheerio.load(html)
      $('.lineup__matchup').each((i, el) => {
        visit = $(el)
          .find('.is-visit')
          .text()
          .replace(/\s\s+/g, '')

        home = $(el)
          .find('.is-home')
          .text()
          .replace(/\s\s+/g, '')

        array.push({
          "v": visit,
          "h": home
        });
      })
      res.send(array)
    }
  })

})



// app.get('/weather', function (req, res) {



//   var array = []
//   request('https://weather.com/weather/today/l/41.13,-73.35?par=google', (error, response, html) => {

//     if (!error && response.statusCode == 200) {
//       const $ = cheerio.load(html)
//       $('.day').each((i, el) => {
//         visit = $(el)
//           .find('.temp')
//           .text()


//         // array.push({
//         //   "v": visit,
//         //   "h": home
//         // });
//       })
//       console.log(visit)
//       //res.send(array)
//     }
//   })



// })


//the specific route handler below is not really needed anymore since by default express looks to server index.html
app.get('/', function (req, res) {
  res.sendFile('index.html');
});

app.post('/data', function (req, res) {
  var data = req.body;
  //console.log(data)
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




















app.listen(process.env.PORT || 5000, function () {
  console.log("going on port", this.address().port, app.settings.env);
});