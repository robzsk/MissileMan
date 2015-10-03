'use strict';

module.exports = function () {
  'use strict';
  var s = function (k, v) {
    if (k && v) {
      localStorage.setItem(k, JSON.stringify(v));
    } else if (k && !v) {
      return JSON.parse(localStorage.getItem(k));
    } else {
      console.error('Key was undefined while using local storage.');
    }
  };
  return {
    test: function (v) {
      return s('test', v);
    },
    error: function () {
      return s();
    }
  };
}();
