const express = require('express');
const axios = require('axios');
const router = express.Router();
require('dotenv').config();
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;

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

router.get('/api/search-books/:sTerms',async(req,res)=>{
  console.log("IM ALIVE")
  const searchTerms=req.params.sTerms
  console.log(searchTerms)
  try{
    const result = await axios.get("https://www.googleapis.com/books/v1/volumes?q="+searchTerms+"&key="+process.env.GOOGLEBOOKSKEY)
    const books=result.data.items
    console.log(books)
    res.status(200).json(books)
  }catch(err){
    console.error("Error fetching books:", err);
    res.status(500).json({ error: "Error fetching books" });
  }
})


router.get('/api/retrieve-book/:id',async(req,res)=>{
  const id=req.params.id;
  console.log(`Retrieving book with ID: ${id}`); // Log the book ID

  try{
    const result=await axios.get("https://www.googleapis.com/books/v1/volumes/"+id)
    const book=result.data;
    const analyzeParams = {
      'html': book.volumeInfo.description,
      'features': {
          'keywords': {
              'emotion': true
            }
      }
    };
    let counter=[["sadness",0],["joy",0],["fear",0],["disgust",0],["anger",0]];
    watson.analyze(analyzeParams).then(analysisResults => {
      console.log(JSON.stringify(analysisResults, null, 2));
      let emotionsList=analysisResults["result"]["keywords"];
      emotionsList.forEach((key)=>{
        emo=key["emotion"]
        counter[0][1]+=emo["sadness"]
        counter[1][1]+=emo["joy"]
        counter[2][1]+=emo["fear"]
        counter[3][1]+=emo["disgust"]
        counter[4][1]+=emo["anger"]
      })
     console.log(counter);
     console.log(getPercentages(counter))
     let distributeJoy=(counter[1][1]*(1/2))/4
     counter[1][1]=counter[1][1]/2
     let i=0;
     for(i=0;i<5;i++){
      if(i!=1){
        counter[i][1]=counter[i][1]+distributeJoy;
        console.log(counter[i][1])
      }
     }
     console.log("New counter!!!:")
     console.log(counter)
      let[sum,percentages]=getPercentages(counter);
      console.log("Sum: " + sum + " Percentages: "+ percentages);
      let energy=percentages[1][1]+percentages[4][1];//Energy=joy+anger
      let valence=(percentages[1][1]+percentages[4][1])*(percentages[0][1]+percentages[2][1]+percentages[3][1])
      console.log("Energy = "+energy);
      console.log("Valence = " + valence);
      //FOR SPOTIFY, USE SOUNDTRACK GENRE
      res.status(200).json([energy,valence])
    })
    .catch(err => {
      console.log('error:', err);
      console.log("Error analyzing description")
    });

  }catch(err){
    console.log(err);
    console.log("Something went wrong with retrieving book and analyzing it")
  }
})

function getPercentages(counter){
  let sum=0;
  counter.forEach((emotion)=>{
    sum=sum+emotion[1]
  })
  let percentages=[];
  counter.forEach((emotion)=>{
    percentages.push([emotion[0],emotion[1]/sum]);
  })
  return [sum,percentages]
}

router.get('/api/spotify/',async(req,res)=>{
  const getAccessToken =  require('./sptfyControl.js').getAccessToken;
const aToken=await getAccessToken();
  console.log(aToken)
  console.log(req.params)
  let energy=req.query.energy;
  let valence=req.query.valence;
  console.log(energy)
  console.log(valence)
  
  console.log("HERERERER")
  console.log("Acess token:" + aToken)
  try{
   const result = await axios.get('https://api.spotify.com/v1/recommendations',{
    params:{
      'seed_genres':'soundtracks',
      'target_instrumentalness':0.75,
      'target_energy':energy,
      'target_valence':valence
    },
    headers:{
      'Authorization':'Bearer '+aToken
    }
  });
    console.log(result.data)
    res.status(200).json(result.data) 
  }catch(err){
    console.log(err);
    console.log("Messed up in retrieving songs recs from spotify")
  }
  
})

module.exports = router;