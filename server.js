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
    return err;
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

app.post('/diary', async function (req, res) {
  try {
    let diaryListLength = await db
      .collection('number')
      .findOne({ name: 'diaryList' });
    diaryListLength = diaryListLength.length;

    db.collection('diaryList').insertOne({ _id: diaryListLength, ...req.body });
    res.json({ _id: diaryListLength });

    db.collection('number').updateOne(
      { name: 'diaryList' },
      { $set: { length: diaryListLength + 1 } }
    );
  } catch (err) {
    return err;
  }
});

app.delete('/diary/:id', function(req,res){
  try{
    let id = parseInt(req.params.id);
    db.collection('diaryList').deleteOne({_id:id})
    res.json({message:'DELETE_SUCCESS'})
  }
  catch(err){
    res.json({message:'DELETE_FAIL'})
    return err
  }
})


app.patch('/diary/:id',function(req,res){
  try{
    let id = parseInt(req.params.id);
    db.collection('diaryList').updateOne({_id:id},{$set:req.body})
    res.json({message:'UPDATE_SUCCESS'})
  }
  catch(err){
    res.json({message:'UPDATE_FAIL'})
    return err
  }
})
