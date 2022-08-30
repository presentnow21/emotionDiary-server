const express = require('express');
const app = express();
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: 'http://localhost:3000' }));
require('dotenv').config();

let db;
MongoClient.connect(process.env.MONGO_URI, function (err, client) {
  if (err) return console.log(err);
  db = client.db('emotionDiary');
  app.listen(process.env.PORT, () => {
    console.log('server opened');
  });
});
