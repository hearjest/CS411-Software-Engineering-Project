const express = require('express');
require('dotenv').config();
const routes = require('./routes.js');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
var session = require('express-session');

const app = express();
const port=process.env.PORT;

app.use(express.json());
app.use('/', routes);
app.listen(port, () => {
    console.log(`Server running at <http://localhost>:${port}`);
});

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))

app.use(passport.initialize());
app.use(passport.session());


app.get('/login', function(req, res){
  res.render('login', { user: req.user });
});

app.get('/auth',
  passport.authenticate('github', { scope: [ 'user:email' ] }));

app.get('/auth/github-login', 
  passport.authenticate('github', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });
  
app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});
  
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: 'http://localhost:4000/auth/github/callback'
}, (accessToken, refreshToken, profile, done) => {
  // Find or create user in your database
  // For demonstration purposes, we'll just return the profile
  console.log("adwiadawda")
  console.log(JSON.stringify(profile, null, 2));  
  return done(null, profile);
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

app.get('/auth/github', passport.authenticate('github'));

app.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    (req, res) => {
        res.redirect('/profile');
    }
);

app.get('/profile', (req, res) => {
    res.send(`<h1>Hello, ${req.user.displayName}!</h1>`);
});
