//var passport = require('passport'), LocalStrategy = require('passport-local').Strategy;
const express = require('express')
const app = express();
const port = 3000;
var cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(express.static(__dirname + '/statics'));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    const user = req.cookies.username;
    res.render(__dirname + '/puzzles.ejs', { user: user });
})

app.get('/puzzles', (req, res) => {
    const user = req.cookies.username;
    res.render(__dirname + '/puzzles.ejs', { user: user });
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
