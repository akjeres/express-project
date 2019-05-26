var express = require('express');
var router = express.Router();
var fs = require('fs-extra');

const { saveName, getUserList } = require("../services/user.service");
const { isAuthorized } = require("../middlewares/auth.middleware");

router.get('/:id', isAuthorized, function(req, res, next) {
  fs.readJson('./files/userlist.json')
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

router.get('/', isAuthorized, function(req, res, next) {
  fs.readJson('./files/userlist.json')
  .then(packageObj => {
    res.send(packageObj)
  })
  .catch(err => {
    res.status(404).send(`User List is invalid<br>${err}`)
  })
});

router.post('/', isAuthorized, function(req, res, next) {
  const result = saveName(req.body);

  if (result) {
    res.send(`Your name is ${result}`);
  } else {
    res.status(400).send(`Some error`);
  }
});

module.exports = router;
