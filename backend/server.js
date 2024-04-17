const express = require('express');
require('dotenv').config();
const routes = require('./routes.js');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;

const app = express();
const port=process.env.PORT;

app.use(express.json());
app.use('/', routes);
app.listen(port, () => {
    console.log(`Server running at <http://localhost>:${port}`);
});

app.use(passport.initialize());
app.use(passport.session());

app.get('/account', ensureAuthenticated, function(req, res){
  res.render('account', { user: req.user });
});

app.get('/login', function(req, res){
  res.render('login', { user: req.user });
});

app.get('/auth',
  passport.authenticate('github', { scope: [ 'user:email' ] }));

app.get('/auth/github-login', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });
  
app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});
  
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}