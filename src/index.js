const path = require('path');
require('dotenv').config({config: path.resolve(__dirname, '..', '.env')});
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const routes = require('./routes');
const db = require('./db');
const PORT = process.env.PORT;

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const appRouter = express.Router();
app.use('/v1', appRouter);
appRouter.use('/auth', routes.auth);
appRouter.use(routes.apply(express.Router()));

app.use((req, res, next) => {
  res.status(404).send({
    status: 404,
    message: 'Not found'
  });
});

// Basic error handler
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).send({
    status,
    message: status < 500 && err.message ? err.message : 'Server error'
  });
});

db.connect()
  .then(() => http.createServer(app).listen(PORT, () => console.log(`App listening on port ${PORT}`)))
  .catch(console.error);
