const Sequelize = require('mongoose');
const config = require('../config');

const db = new Sequelize(config.db.dbname, config.db.username, config.db.password, {
  host: config.db.host,
  dialect: config.db.dialect,
  logging: config.db.logging,
  pool: {
    max: 5,
    min: 0,
    idle: 10000,
  },
});
global.db = db;
db.sync();
module.exports = db;
