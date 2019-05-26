const { saveData } = require("../repositories/user.repository");
const fs = require('fs-extra');

const getUserList = () => {
  return fs.readJson('./files/userlist.json');
}

const getName = (user) => {
  if (user) {
    return user.name;
  } else {
    return null;
  }
};

const saveName = (user) => {
  if (user) {
    return saveData(user.name);
  } else {
    return null;
  }
};

const saveUser = (user) => {
  if (user) {
    if (user.length) {
      return Array.from(user);
    }
    return [user];
  } else {
    return null;
  }
}

module.exports = {
  getName,
  saveName,
  getUserList,
  saveUser,
};