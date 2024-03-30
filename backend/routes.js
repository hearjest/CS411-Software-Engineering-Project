const express = require('express');
const axios = require('axios');
const router = express.Router();
require('dotenv').config();

const aToken = require('./sptfyControl.js');
const watson = require('./watsonControl.js');


/*Get spotify access token*/

/*Google books API barely needs anything 
https://www.googleapis.com/books/v1/volumes?q=stormlight+inauthor:sanderson&key=AIzaSyBprmOjBfGb6P3J2ivZ_58hvpZVLeI7AmA */

module.exports = router;