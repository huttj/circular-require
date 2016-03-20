const a = require('./a');

module.exports = {
  fn: function() {
    console.log('This is b. a is', a);
  }
};