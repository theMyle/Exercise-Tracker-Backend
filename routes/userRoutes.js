const express = require('express');
const router = express.Router();

// will act as in memory database
// _id as primary and foreign keys
let users = {};       // users table
let exercises = {};   // exercises table
let logs = {};        // logs table

let UID = {
  id: 0,
  generateNewUID() {
    return ++this.id;
  }
}

router.route('/')
  // return all users
  .get((req, res) => {
    res.json(Object.values(users));
  })
  // creates new user
  .post((req, res) => {
    const username = req.body.username;
    const newUID = String(UID.generateNewUID());
    const newUser = {username: username, _id: newUID};

    users[newUID] = newUser 
    exercises[newUID] = []
    logs[newUID] = {
      username: username,
      count: 0,
      _id: newUID,
      log: []
    }

    res.json(newUser);
  })

router.post('/:_id/exercises', (req, res) => {
  const UID = Number(req.params._id);
  const description = req.body.description;
  const duration = Number(req.body.duration);
  let date = req.body.date;

  if (!date) {
    date = new Date().toDateString();
  } else {
    date = new Date(date).toDateString();
  }

  logs[UID].log.push({
    description: description,
    duration: duration,
    date: date
  });

  logs[UID].count++;

  exercises[UID].push({
    description: description,
    duration: duration,
    date: date
  });

  res.json({
    username: users[UID].username,
    _id: UID,
    description: description,
    duration: duration,
    date: date
  });
});

router.get('/:_id/logs', (req, res) => {
  const userID = Number(req.params._id);
  let { from, to, limit } = req.query;

  let exercises = logs[userID];
  let filteredList = exercises.log;   // default

  limit = Number(limit) || 0;

  // filter dates based on queries
  if (from && to) {
    from = new Date(from);
    to = new Date(to);
    
    filteredList = filteredList.filter(entry => {
      let entryDate = new Date(entry.date);
      return entryDate >= from && entryDate <= to;
    });
  } 

  // filter if limit is present
  if (limit > 0) {
    filteredList = filteredList.slice(0, limit);
  }

  res.json({
    username: exercises.username,
    count: exercises.count,
    _id: exercises._id,
    log: filteredList
  });
});

module.exports = router;
