const a = require('./a');
const b = require('./b');

a.fn(); // This is a. b is { fn: [Function] }
b.fn(); // This is b. a is {}

console.log('a is actually', a); // { fn: [Function] }
console.log('b is actually', b); // { fn: [Function] }