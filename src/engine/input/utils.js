const isMatch = (a, b) =>
  Object.keys(a).reduce((r, k) =>
    r && a[k] === b[k]
  , true);

// for each key in the obj, create an new object where the value is false
const falsify = obj =>
  Object.keys(obj).reduce((a, c) => {
    a[c] = false;
    return a;
  }, {});

const assign = Object.assign;

module.exports = {
  assign,
  falsify,
  isMatch,
};
