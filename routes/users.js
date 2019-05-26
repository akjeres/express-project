var express = require('express');
var router = express.Router();
const fs = require('fs-extra');

const { saveName, getUserList, saveUser } = require("../services/user.service");
const { isAuthorized } = require("../middlewares/auth.middleware");

router.get('/', isAuthorized, function(req, res, next) {
  getUserList()
  .then(packageObj => {
    res.send(packageObj)
  })
  .catch(err => {
    res.status(500).send(`User List is invalid<br>${err}`)
  })
});

router.get('/:id', isAuthorized, function(req, res, next) {
  getUserList()
  .then(resolve => {
    userList = resolve;
    let status = 404,
    userData = `User with _id = ${req.params.id} is not defined`;
    for (let i = 0; i < resolve.length; i++) {
      let currentUser = resolve[i];
      
      if (req.params.id == currentUser['_id']) {
        status = 200;
        userData = currentUser;
        break;
      }
    }
    res.status(status).send(userData);
  },
    reject => {
      status = 500;
      throw new Error('User list is invalid');
    }
  )
  .catch(err => {
    res.status(status).send(err.message)
  })
});

router.post('/', isAuthorized, function(req, res, next) {
  const result = saveUser(req.body);

  if (result) {
    let currentUserList = getUserList();
    let len;
    currentUserList
    .then(resolve => {
      let dataToSave = Array.from(resolve);
      result.forEach((j) => {
        
        if (!('_id' in j)) j['_id'] = (dataToSave.length + 1).toString();
        if (dataToSave.some((k) => k['_id'] == j['_id'])) {
          res.status(403).send(`User with '_id' = ${j['_id']} exists. Please change the '_id'`);
          throw new Error(`User with '_id' = ${j['_id']} exists. Please change the '_id'`);
        }
        dataToSave.push(j);
      });
      fs.writeJson('./files/userlist.json', dataToSave, err => {
        if (err) {
          res.status(500).send(err);
          throw new Error(err);
        }
  
        res.send(dataToSave);
      });
    }, reject => {
      throw new Error('Some error happened');
    })
    .catch(err => {
      throw new Error(err);
    });
  } else {
    res.status(400).send(`Some error`);
  }
});

module.exports = router;
