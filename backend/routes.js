const express = require('express');
const axios = require('axios');
const router = express.Router();
require('dotenv').config();
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const aToken = require('./sptfyControl.js');
const watson = require('./watsonControl.js');
const session = require('express-session');
const db=require('./database.js')


/*Get spotify access token*/

/*Google books API barely needs anything 
https://www.googleapis.com/books/v1/volumes?q=stormlight+inauthor:sanderson&key=AIzaSyBprmOjBfGb6P3J2ivZ_58hvpZVLeI7AmA */


//Everything below is OAuth stuff
router.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))

router.use(passport.initialize());
router.use(passport.session());


router.get('/login', function(req, res){
  res.render('login', { user: req.user });
});

router.get('/auth',
  passport.authenticate('github', { scope: [ 'user:email' ] }));

router.get('/auth/github-login', 
  passport.authenticate('github', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });
  
router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});
  
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: 'http://localhost:4000/auth/github/callback'
}, async (accessToken, refreshToken, profile, done) => {
  // Find or create user in your database
  // For demonstration purposes, we'll just return the profile
  console.log("adwiadawda")
  data=JSON.parse(JSON.stringify(profile, null, 2))
  console.log(data.id);  
  console.log(data.displayName);  
  console.log(data.username);  
  const res = await db.login(data.id,data.username,"a",data.displayName,"lastname!")
  return done(null, profile);
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

router.get('/auth/github', passport.authenticate('github'));

router.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    (req, res) => {
        res.redirect('/profile');
    }
);

router.get('/profile', (req, res) => {
    res.send(`<h1>Hello, ${req.user.displayName}!</h1>`);
});


//Database stuff
router.post('/register',async (req,res)=>{
  const {id,username,password,name,lastname}=req.body;
  console.log(id,username,password,name,lastname)
  try{
    const result = await db.registerUser(id,username,password,name,lastname);
    res.status(200).json(result);
  }catch{
    res.status(400).json({err: err.message})
  }
})
module.exports = router;