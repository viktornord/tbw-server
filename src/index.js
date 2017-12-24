require('dotenv').config({config: '../.env'});
const http = require('http');
const express = require('express');
const PORT = process.env.PORT;

const app = express();

http.createServer(app).listen(PORT, () => console.log(`App listening on port ${PORT}`));
