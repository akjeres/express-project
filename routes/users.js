var express = require('express');
var router = express.Router();
var fs = require('fs-extra');

const { saveName, getUserList } = require("../services/user.service");
const { isAuthorized } = require("../middlewares/auth.middleware");

router.get('/', function(req, res, next) {
  fs.readJson('./files/userlist.json')
  .then(packageObj => {
    res.send(packageObj)
  })
  .catch(err => {
    res.status(500).send(`User List is not defined<br>${err}`)
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
