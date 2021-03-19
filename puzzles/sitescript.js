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
    res.clearCookie('username');
    MongoClient.connect(url, function (err, client) {
      if (err) throw err
      var db = client.db(dbName);
      db.collection('psd').find().toArray(function (err, result) {
        if (err) throw err

        //ISSUE: ONLY WORKS IF YOU START WITH SITESCRIPT.JS, GOING TO PUZZLES.EJS WITHOUT GOING THROUGH
        //SITESCRIPT.JS WILL NOT LOAD THE PAGE. 
          res.render(__dirname + '/puzzles.ejs', { user: null, records: result, scoreError: null });
      })
    })
})

app.get('/puzzles', (req, res) => {
    const user = req.cookies.username;
    MongoClient.connect(url, function (err, client) {
        if (err) throw err
        var db = client.db(dbName);

        db.collection('psd').find().toArray(function (err, result) {
            if (err) throw err

            //ISSUE: ONLY WORKS IF YOU START WITH SITESCRIPT.JS, GOING TO PUZZLES.EJS WITHOUT GOING THROUGH
            //SITESCRIPT.JS WILL NOT LOAD THE PAGE. 
            res.render(__dirname + '/puzzles.ejs', { user: user, records: result, scoreError: null });
        })
    })
})

app.get('/ranking', (req, res) => {
    res.render(__dirname + '/ranking.ejs');
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
        res.cookie('username', 'bruh');
        const user = req.cookies.username;
        //console.log(req.cookies.username);
        MongoClient.connect(url, function (err, client) {
            if (err) throw err
            var db = client.db(dbName);

            db.collection('psd').find().toArray(function (err, result) {
                if (err) throw err

                //ISSUE: ONLY WORKS IF YOU START WITH SITESCRIPT.JS, GOING TO PUZZLES.EJS WITHOUT GOING THROUGH
                //SITESCRIPT.JS WILL NOT LOAD THE PAGE. 
                res.render(__dirname + '/puzzles.ejs', { user: 'bruh', records: result, scoreError: null });
            })
        })
    }
    else {
        res.clearCookie('username');
        res.clearCookie('name');
        //const user = req.cookies.username;
        MongoClient.connect(url, function (err, client) {
            if (err) throw err
            var db = client.db(dbName);

            db.collection('psd').find().toArray(function (err, result) {
                if (err) throw err

                //ISSUE: ONLY WORKS IF YOU START WITH SITESCRIPT.JS, GOING TO PUZZLES.EJS WITHOUT GOING THROUGH
                //SITESCRIPT.JS WILL NOT LOAD THE PAGE. 
                res.render(__dirname + '/puzzles.ejs', { user: null, records: result, scoreError: null });
            })
        })
    }
});

app.post('/signup', (req, res) => {
    res.clearCookie('username');
    const username = req.body.username;
    const password = req.body.password;
    res.cookie(username, password);
    MongoClient.connect(url, function (err, client) {
        if (err) throw err
        var db = client.db(dbName);

        db.collection('psd').find().toArray(function (err, result) {
            if (err) throw err

            //ISSUE: ONLY WORKS IF YOU START WITH SITESCRIPT.JS, GOING TO PUZZLES.EJS WITHOUT GOING THROUGH
            //SITESCRIPT.JS WILL NOT LOAD THE PAGE. 
            res.render(__dirname + '/puzzles.ejs', { user: username, records: result, scoreError: null});
        })
    })

});

app.post('/score', (req, res) => {
    const username = req.cookies.username;
    MongoClient.connect(url, function (err, client) {
        if (err) throw err
        var db = client.db(dbName);

        db.collection('psd').find().toArray(function (err, result) {
            if (err) throw err

            //ISSUE: ONLY WORKS IF YOU START WITH SITESCRIPT.JS, GOING TO PUZZLES.EJS WITHOUT GOING THROUGH
            //SITESCRIPT.JS WILL NOT LOAD THE PAGE. 
            if (username == null) {
                res.render(__dirname + '/puzzles.ejs', { user: username, records: result, scoreError: 'please log in' });
            }
            else {
                //console.log(req.body.answer);
                if (req.body.answer == 'answer') {
                    //add to score
                    res.render(__dirname + '/puzzles.ejs', { user: username, records: result, scoreError: 'correct!' });
                }
                else {
                    res.render(__dirname + '/puzzles.ejs', { user: username, records: result, scoreError: 'incorrect answer' });
                }
            }    
        })
    })
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});
