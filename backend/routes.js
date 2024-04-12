const express = require('express');
const axios = require('axios');
const router = express.Router();
require('dotenv').config();
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const aToken = require('./sptfyControl.js');
const watson = require('./watsonControl.js');


/*Get spotify access token*/

/*Google books API barely needs anything 
https://www.googleapis.com/books/v1/volumes?q=stormlight+inauthor:sanderson&key=AIzaSyBprmOjBfGb6P3J2ivZ_58hvpZVLeI7AmA */
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/github-login"
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate({ githubId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));

module.exports = router;