//var passport = require('passport'), LocalStrategy = require('passport-local').Strategy;
const express = require('express')
const app = express();
const port = 3000;
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
var cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(express.static(__dirname + '/statics'));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

//mongodb vars
const url = 'mongodb+srv://ourgroup:fullstackatbrown@cluster0.urser.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
const dbName = 'puzzlesitedata'

app.get('/', (req, res) => {
    const user = req.cookies.username;
    MongoClient.connect(url, function (err, client) {
      if (err) throw err
      var db = client.db(dbName);

      db.collection('psd').find().toArray(function (err, result) {
        if (err) throw err

        //ISSUE: ONLY WORKS IF YOU START WITH SITESCRIPT.JS, GOING TO PUZZLES.EJS WITHOUT GOING THROUGH
        //SITESCRIPT.JS WILL NOT LOAD THE PAGE. 
        res.render(__dirname + '/puzzles.ejs', { user: user, records: result });
      })
    })
})

app.get('/puzzles', (req, res) => {
    const user = req.cookies.username;
    res.render(__dirname + '/puzzles.ejs', { user: user });
})

app.get('/ranking', (req, res) => {
    res.render(__dirname + '/ranking.ejs', );
})

app.get('/your%20score', (req, res) => {
    res.render(__dirname + '/score.ejs');
})

app.post('/login', (req, res) => {
    res.clearCookie('username');
    res.clearCookie('name');
    const username = req.body.username;
    const password = req.body.password;
    if (username == 'bruh' && password == 'pass') {
        res.cookie('username', 'bruh')
        const user = req.cookies.username;
        res.render(__dirname + '/puzzles.ejs', { user: 'bruh' });
    }
    else {
        res.clearCookie('username');
        res.clearCookie('name');
        res.render(__dirname + '/puzzles.ejs', { user: null });
    }
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
