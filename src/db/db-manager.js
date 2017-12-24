const mongoose = require('mongoose');

const MONGO_URL = process.env.MONGO_URL;
console.log(MONGO_URL);

class DatabaseManager {

  constructor() {
    mongoose.Promise = global.Promise;
  }

  /**
   * Establish connection with a database
   *
   * @returns {Promise.<Db>}
   */
  async connect() {
    try {
      this.db = await mongoose.connect(MONGO_URL, {useMongoClient: true});
      console.log(`Database connection is established. MONGO URL is ${MONGO_URL}`);

      return this.db;
    } catch (error) {
      console.warn(`Failed to establish database connection. MONGO URL ${MONGO_URL}`);
      console.error(error);

      throw error;
    }
  }
}

module.exports = new DatabaseManager();