const mongoose = require("mongoose");

let _db;

const mongoConnect = async () => {
  const con = await mongoose.connect(process.env.MONGO_URI);
  _db = con.connection;
  return _db;
};

const getDB = async () => {
  if (_db) {
    return _db;
  }
  return await mongoConnect();
};

module.exports = getDB;
