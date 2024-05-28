const express = require('express');
require('dotenv').config();
const routes = require('./routes.js');
const app = express();
const cors = require('cors');
const port=process.env.PORT;

app.use(cors());
app.use(express.json());
app.use('/', routes);

app.listen(port, () => {
    console.log(`Server running at <http://localhost>:${port}`);
});

