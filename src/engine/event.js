module.exports = function () {
  'use strict';

  var cache = [],

    callMethod = function (method) {
      method();
    };

  return function (a) {
    var obj = _.find(cache, function (o) {
      return o.a === a;
    });

    if (_.isUndefined(obj)) {
      obj = { a: a };
      +function () {
        var listeners = {};
        obj.off = function (evt, callback) {
          listeners = _.without(listeners, callback);
        };
        obj.on = function (evt, callback) {
          if (_.isUndefined(listeners[evt])) {
            listeners[evt] = [];
          }
          listeners[evt].push(callback);
        };
        obj.trigger = function (evt, p) {
          var ls = listeners[evt];
          if (_.isObject(ls)) {
            _.each(ls, function (m) {
              m.apply(obj, p || []);
            });
          }
        };
      }();
      cache.push(obj);
    }

    return obj;
  };
}();
