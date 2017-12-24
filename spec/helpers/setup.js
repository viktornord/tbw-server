require('dotenv').config({config: '../../.env'});
process.env.MONGO_URL= process.env.MONGO_URL_TEST;
require('../../src');
