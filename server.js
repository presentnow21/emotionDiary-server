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

app.get('/diary', async function (req, res) {
  try {
    let result = await db.collection('diaryList').find().toArray();
    res.json(result);
  } catch (err) {
    res.json({ message: 'FAIL' });
  }
});

app.get('/diary/:id', async function (req, res) {
  let id = parseInt(req.params.id);
  try {
    let result = await db.collection('diaryList').findOne({ _id: id });
    if (result == null) throw new Error('no exist diary');
    else res.json(result);
  } catch (err) {
    return res.sendStatus(400);
  }
});
