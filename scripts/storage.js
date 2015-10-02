'use strict';

var storage = function () {
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

storage.test({nothing: 'supplied'});

console.log(storage.test().nothing);
