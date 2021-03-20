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
    //clear cookie
    res.clearCookie('username');
    //connect to mongo and display page/rankings
    MongoClient.connect(url, function (err, client) {
      if (err) throw err
      var db = client.db(dbName);
        db.collection('psd').find().sort({ score: -1 }).toArray(function (err, result) {
        if (err) throw err
            result.length = 5;
            res.render(__dirname + '/puzzles.ejs', { user: null, records: result, scoreError: null, userScore: null });
      })
    })
})

app.get('/puzzles', (req, res) => {
    //get current user
    const user = req.cookies.username;
    //connect to mongo
    MongoClient.connect(url, function (err, client) {
        if (err) throw err
        var db = client.db(dbName);
        db.collection('psd').find().sort({ score: -1 }).toArray(function (err, result) {
            if (err) throw err
            var i;
            var score;
            //find score to display
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
    //connect to mongo and show full rankings
    MongoClient.connect(url, function (err, client) {
        if (err) throw err
        var db = client.db(dbName);
        db.collection('psd').find().sort({ score: -1 }).toArray(function (err, result) {
            if (err) throw err
            res.render(__dirname + '/ranking.ejs', { user: null, records: result, scoreError: null, userScore: null });
        })
    })
})

app.post('/login', (req, res) => {
    //clear cookies and get new user/pass
    res.clearCookie('username');
    res.clearCookie('name');
    const username = req.body.username;
    const password = req.body.password;
    //connect to mongo
    MongoClient.connect(url, function (err, client) {
        if (err) throw err
        var db = client.db(dbName);
        db.collection('psd').find().sort({ score : -1 }).toArray(function (err, result) {
            if (err) throw err
            //check if user and password are valid combo
            var i;
            var newUser;
            for (i = 0; i < result.length; i++) {
                if (result[i].username == username && result[i].password == password) {
                    newUser = result[i].username;
                }
            }
            //get score for user display
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
        })
    })
});

app.post('/signup', (req, res) => {
    //clear cookies and get user/pass
    res.clearCookie('username');
    const username = req.body.username;
    const password = req.body.password;
    res.cookie(username, password);
    //connect to mongo
    MongoClient.connect(url, function (err, client) {
        if (err) throw err
        var db = client.db(dbName);
        db.collection('psd').find().sort({ score: -1 }).toArray(function (err, result) {
            if (err) throw err
            //check if username is already registered.
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
        })
    })

});

app.post('/score', (req, res) => {
    //get current user
    const username = req.cookies.username;
    //connect to mongo
    MongoClient.connect(url, function (err, client) {
        if (err) throw err
        var db = client.db(dbName);
        //if answer is right, increment score.
        if (req.body.answer == 'answer') {
            db.collection('psd').update({ username: username }, { $inc: { score: 1 } });
        }
        db.collection('psd').find().sort({ score: -1 }).toArray(function (err, result) {
            if (err) throw err
            //make sure they are logged in
            if (username == null) {
                result.length = 5;
                res.render(__dirname + '/puzzles.ejs', { user: username, records: result, scoreError: 'please log in', userScore: null });
            }
            else {
                //get score to display for user
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
