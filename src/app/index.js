require('dotenv').config({config: '../../.env'});
const http = require('http');
const express = require('express');
const db = require('./db');
const PORT = process.env.PORT;

const app = express();

db.connect()
  .then(() => http.createServer(app).listen(PORT, () => console.log(`App listening on port ${PORT}`)))
  .catch(console.error);
