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
    currentUserList
    .then(resolve => {
      let dataToSave = Array.from(resolve);
      result.forEach((j) => {
        if (isNaN(Number(j["_id"])) || Number(j["_id"]) == 0) {
          res.status(400).send('Invalid User _id');
          throw new Error('Invalid User _id');
        }
        if (!('_id' in j)) j['_id'] = (parseInt(dataToSave[dataToSave.length - 1]["_id"]) + 1).toString();
        if (dataToSave.some((k) => k['_id'] == j['_id'])) {
          res.status(403).send(`User with '_id' = ${j['_id']} exists. Please change the '_id'`);
          throw new Error(`User with '_id' = ${j['_id']} exists. Please change the '_id'`);
        }
        dataToSave.push(j);
      });
      dataToSave.sort((a, b) => {
        let innA = parseInt(a['_id']);
        let innB = parseInt(b['_id']);
        if (innA > innB) {
          return 1;
        }
        if (innB > innA) {
          return -1;
        }
        return 0;
      });
      fs.writeJson('./files/userlist.json', dataToSave, err => {
        if (err) {
          res.status(500).send(err);
          throw new Error(err);
        }
  
        res.send(dataToSave);
      });
    }, reject => {
      res.status(500).send('Cannot load Users List');
      throw new Error('Cannot load Users List');
    })
    .catch(err => {
      res.status(err.status).send(err.message);
    });
  } else {
    res.status(400).send(`Empty user data`);
  }
});

router.put('/:id', isAuthorized, function(req, res, next) {
  if (req.params && !!req.params.id) {
    const ID = req.params.id;
    let updatedUser = req.body;
    let currentUserList = getUserList(), msg, stat;
    currentUserList
    .then(resolve => {
      let dataToSave = Array.from(resolve);
      if (dataToSave.some((i) => i['_id'] == ID)) {
        if (Array.isArray(req.body)) {
          msg = 'Invalid data provided';
          stat = 400;
          res.status(stat).send(msg);
          throw new Error({
            status: stat,
            message: msg,
          });
        } else {
          if ('_id' in updatedUser && updatedUser['_id'] != ID) {
            msg = `You can not change User ID`;
            stat = 403;
            res.status(stat).send(msg);
            throw new Error({
              status: stat,
              message: msg,
            });
          } else {
            dataToSave = dataToSave.map((i) => {
              if (i['_id'] == ID) {
                updatedUser = Object.assign(i, updatedUser);
                return updatedUser;
              }
              return i;
            });
            fs.writeJson('./files/userlist.json', dataToSave, err => {
              if (err) {
                res.status(500).send(err);
                throw new Error(err);
              }
        
              res.send(dataToSave);
            });
          }
        }
      } else {
        msg = `User with '_id' = ${ID} does not exist. Please change the '_id'`;
        stat = 403;
        res.status(stat).send(msg);
        throw new Error({
          status: stat,
          message: msg,
        });
      }
    }, reject => {
      stat = 500;
      msg = 'Cannot load Users List'
      throw new Error({
        status: stat,
        message: msg,
      });
    })
    .catch(err => {
      res.status(stat).send(msg);
    });
  } else {
    res.status(403).send(`Invalid ID`);
    throw new Error(`Invalid ID`);
  }
});

router.delete('/:id', isAuthorized, function(req, res, next) {
  if (req.params && !!req.params.id) {
    const ID = req.params.id;
    let currentUserList = getUserList(), msg, stat;
    currentUserList
    .then(resolve => {
      let dataToSave = Array.from(resolve);
      if (dataToSave.some((i) => i['_id'] == ID)) {
        let result = [];
        dataToSave.map((j) => {
          if (j['_id'] != ID) result.push(j);
        });
        fs.writeJson('./files/userlist.json', result, err => {
          if (err) {
            res.status(500).send(err);
            throw new Error(err);
          }
    
          res.send(result);
        });
      } else {
        msg = `User with '_id' = ${ID} does not exist. Please change the '_id'`;
        stat = 403;
        res.status(stat).send(msg);
        throw new Error({
          status: stat,
          message: msg,
        });
      }
    }, reject => {
      stat = 500;
      msg = 'Cannot load Users List'
      throw new Error({
        status: stat,
        message: msg,
      });
    })
    .catch(err => {
      res.status(stat).send(msg);
    });
  } else {
    res.status(403).send(`Invalid ID`);
    throw new Error(`Invalid ID`);
  }
});

module.exports = router;
