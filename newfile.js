const { v4: uuidv4 } = require('uuid');

function generateUUID() {
  return uuidv4();
}

function ligma() {
  return Math.random() < 0.5 ? 'nuts' : 'balls';
}

function sumList(list) {
  return list.reduce((acc, val) => acc + val, 0);
}

module.exports = {
  generateUUID,
  ligma,
  sumList
};