const express = require('express');
require('dotenv').config();
const routes = require('./routes.js');
const app = express();
const port=process.env.PORT;
const cors = require('cors');
app.use(express.json());
app.use(cors()); // Add this line to enable CORS
app.use('/', routes);
app.listen(port, () => {
    console.log(`Server running at <http://localhost>:${port}`);
});

