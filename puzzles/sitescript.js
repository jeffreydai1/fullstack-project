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
        db.collection('psd').find().sort({ score: -1 }).toArray(function (err, result) {
        if (err) throw err

        //ISSUE: ONLY WORKS IF YOU START WITH SITESCRIPT.JS, GOING TO PUZZLES.EJS WITHOUT GOING THROUGH
        //SITESCRIPT.JS WILL NOT LOAD THE PAGE. 
            result.length = 5;
            res.render(__dirname + '/puzzles.ejs', { user: null, records: result, scoreError: null, userScore: null });
      })
    })
})

app.get('/puzzles', (req, res) => {
    const user = req.cookies.username;
    MongoClient.connect(url, function (err, client) {
        if (err) throw err
        var db = client.db(dbName);

        db.collection('psd').find().sort({ score: -1 }).toArray(function (err, result) {
            if (err) throw err

            //ISSUE: ONLY WORKS IF YOU START WITH SITESCRIPT.JS, GOING TO PUZZLES.EJS WITHOUT GOING THROUGH
            //SITESCRIPT.JS WILL NOT LOAD THE PAGE. 
            var i;
            var score;
            for (i = 0; i < result.length; i++) {
                if (result[i].username == user) {
                    score = result[i].score;
                }
            }
            result.length = 5;
            res.render(__dirname + '/puzzles.ejs', { user: user, records: result, scoreError: null, userScore: score });
        })
    })
})

app.get('/ranking', (req, res) => {
    MongoClient.connect(url, function (err, client) {
        if (err) throw err
        var db = client.db(dbName);
        db.collection('psd').find().sort({ score: -1 }).toArray(function (err, result) {
            if (err) throw err

            //ISSUE: ONLY WORKS IF YOU START WITH SITESCRIPT.JS, GOING TO PUZZLES.EJS WITHOUT GOING THROUGH
            //SITESCRIPT.JS WILL NOT LOAD THE PAGE. 
            res.render(__dirname + '/ranking.ejs', { user: null, records: result, scoreError: null, userScore: null });
        })
    })
})

app.post('/login', (req, res) => {
    res.clearCookie('username');
    res.clearCookie('name');
    const username = req.body.username;
    const password = req.body.password;
    MongoClient.connect(url, function (err, client) {
        if (err) throw err
        var db = client.db(dbName);

        db.collection('psd').find().sort({ score : -1 }).toArray(function (err, result) {
            if (err) throw err
            var i;
            var newUser;
            for (i = 0; i < result.length; i++) {
                if (result[i].username == username && result[i].password == password) {
                    newUser = result[i].username;
                }
            }
            i = 0;
            var score;
            for (i = 0; i < result.length; i++) {
                if (result[i].username == newUser) {
                    score = result[i].score;
                }
            }
            if (newUser != null) {
                res.cookie('username', newUser);
                result.length = 5;
                res.render(__dirname + '/puzzles.ejs', { user: newUser, records: result, scoreError: null, userScore: score });
            }
            else {
                res.clearCookie('username');
                res.clearCookie('name');
                result.length = 5;
                res.render(__dirname + '/puzzles.ejs', { user: null, records: result, scoreError: 'incorrect username or password', userScore: null });
            }
            //ISSUE: ONLY WORKS IF YOU START WITH SITESCRIPT.JS, GOING TO PUZZLES.EJS WITHOUT GOING THROUGH
            //SITESCRIPT.JS WILL NOT LOAD THE PAGE. 
            //res.render(__dirname + '/puzzles.ejs', { user: 'bruh', records: result, scoreError: null });
        })
    })
});

app.post('/signup', (req, res) => {
    res.clearCookie('username');
    const username = req.body.username;
    const password = req.body.password;
    res.cookie(username, password);
    MongoClient.connect(url, function (err, client) {
        if (err) throw err
        var db = client.db(dbName);

        db.collection('psd').find().sort({ score: -1 }).toArray(function (err, result) {
            if (err) throw err
            var i;
            var name;
            for (i = 0; i < result.length; i++) {
                if (result[i].username == username) {
                    name = result[i].username;
                }
            }
            if (name == null) {
                db.collection('psd').insertOne({ username: username, password: password, score: 0 });
                result.length = 5;
                res.render(__dirname + '/puzzles.ejs', { user: username, records: result, scoreError: null, userScore: 0 });
            }
            else {
                result.length = 5;
                res.render(__dirname + '/puzzles.ejs', { user: username, records: result, scoreError: 'Username already exists.', userScore: null });
            }
            //ISSUE: ONLY WORKS IF YOU START WITH SITESCRIPT.JS, GOING TO PUZZLES.EJS WITHOUT GOING THROUGH
            //SITESCRIPT.JS WILL NOT LOAD THE PAGE. 

        })
    })

});

app.post('/score', (req, res) => {
    const username = req.cookies.username;
    MongoClient.connect(url, function (err, client) {
        if (err) throw err
        var db = client.db(dbName);
        if (req.body.answer == 'answer') {
            db.collection('psd').update({ username: username }, { $inc: { score: 1 } });
        }
        db.collection('psd').find().sort({ score: -1 }).toArray(function (err, result) {
            if (err) throw err

            //ISSUE: ONLY WORKS IF YOU START WITH SITESCRIPT.JS, GOING TO PUZZLES.EJS WITHOUT GOING THROUGH
            //SITESCRIPT.JS WILL NOT LOAD THE PAGE. 
            if (username == null) {
                result.length = 5;
                res.render(__dirname + '/puzzles.ejs', { user: username, records: result, scoreError: 'please log in', userScore: null });
            }
            else {
                var i;
                var score;
                for (i = 0; i < result.length; i++) {
                    if (result[i].username == username) {
                        score = result[i].score;
                    }
                }
                if (req.body.answer == 'answer') {
                    result.length = 5;
                    res.render(__dirname + '/puzzles.ejs', { user: username, records: result, scoreError: 'correct!', userScore: score });
                }
                else {
                    result.length = 5;
                    res.render(__dirname + '/puzzles.ejs', { user: username, records: result, scoreError: 'incorrect answer', userScore: score });
                }
            }    
        })
    })
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
});
