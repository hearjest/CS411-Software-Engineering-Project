const axios = require('axios');
require('dotenv').config();

async function getAccessToken() {
    try {
        const response = await axios.post(
            'https://accounts.spotify.com/api/token',
            'grant_type=client_credentials',
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                auth: {
                    username: process.env.SPTFY_CLIENT_ID,
                    password: process.env.SPTFY_CLIENT_SECRET,
                },
            }
        );

        const accessToken = response.data.access_token;
        console.log('Spotify access token:', accessToken);
        return accessToken;
    } catch (error) {
        console.error('Error fetching access token:', error.message);
        throw error; // Rethrow the error or handle it as needed
    }
}

module.exports.getAccessToken = getAccessToken;
