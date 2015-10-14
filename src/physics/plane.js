module.exports = function (n, p) {
  return {
    normal: n,
    constant: n.dot(p)
  };
};
