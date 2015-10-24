module.exports = function () {
  'use strict';
  const event = require('./event');
  const stats = function () {
    var s = {begin: function () {},end: function () {}};

    if (typeof Stats !== 'undefined') {
      s = new Stats();
      s.setMode(0);
      s.domElement.style.position = 'absolute';
      s.domElement.style.left = '0px';
      s.domElement.style.top = '0px';
      $('body').append(s.domElement);
    }
    return s;
  }();

  const timestamp = function () {
    return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
  };

  var loop,
    paused = false,
    step = 1 / 60,
    dt = 0,
    now,
    last = timestamp(),
    ticks = 0;

  +function run () {
    requestAnimationFrame(run);
    stats.begin();
    now = timestamp();
    dt = now - last;
    last = now;
    event(loop).trigger('loop.update', [ticks, step]);
    event(loop).trigger('loop.render', [dt]);
    ticks += 1;
    stats.end();
  }();

  loop = {
    reset: function () {
      ticks = 0;
    }
  };
  return loop;
}();
