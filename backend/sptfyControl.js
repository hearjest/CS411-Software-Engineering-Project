const axios = require('axios');
require('dotenv').config();

let aToken;
axios.post('https://accounts.spotify.com/api/token', 
    'grant_type=client_credentials&client_id='+process.env.SPTFY_CLIENT_ID+'&client_secret='+process.env.SPTFY_CLIENT_SECRET+'', {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
}).then(function (response) {
    aToken=response.data.access_token;
    console.log("Spotify access token:"+aToken)
}).catch(function (error) {
    console.error(error);
});

module.exports=aToken;