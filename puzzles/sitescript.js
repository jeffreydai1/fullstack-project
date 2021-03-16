//var passport = require('passport'), LocalStrategy = require('passport-local').Strategy;
const express = require('express')
const app = express();
const port = 3000;
app.use(express.static(__dirname + '/statics'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/puzzles.html');
})

app.get('/puzzles', (req, res) => {
    res.sendFile(__dirname + '/puzzles.html');
})

app.get('/ranking', (req, res) => {
    res.sendFile(__dirname + '/ranking.html');
})

app.get('/your%20score', (req, res) => {
    res.sendFile(__dirname + '/score.html');
})


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

/*
app.post('/login',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    })
);
*/