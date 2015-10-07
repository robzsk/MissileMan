'use strict';

var METER = 1,
  GRAVITY = 9.8 * 6, // default (exagerated) gravity
  MAXDX = 15, // default max horizontal speed (15 tiles per second)
  MAXDY = 60, // default max vertical speed   (60 tiles per second)
  ACCEL = 1 / 2, // default take 1/2 second to reach maxdx (horizontal acceleration)
  FRICTION = 1 / 6, // default take 1/6 second to stop from maxdx (horizontal friction)
  IMPULSE = 1500; // default player jump impulse

module.exports = function (conf) {
  var obj = conf.obj;
  var player = {
    x: obj.x,
    y: obj.y,
    dx: 0,
    dy: 0,
    gravity: GRAVITY,
    maxdx: MAXDX,
    maxdy: MAXDY,
    impulse: IMPULSE,
    accel: MAXDX / ACCEL,
    friction: MAXDX / FRICTION,
    left: false,
    right: false,
    jump: false,
    start: { x: obj.x, y: obj.y },
  };

  var handleInput = function (e, m) {
    player.left = m.left;
    player.right = m.right;
    player.jump = m.jump;
  };

  $(conf.input).on('input.move', handleInput);

  player.reset = function () {
    player.jump = player.left = player.right = false;
    player.dx = player.dy = 0;
    player.x = player.start.x;
    player.y = player.start.y;
  };

  player.detatchInput = function () {
    $(conf.input).off('input.move', handleInput);
  };

  player.update = function (ticks) {
    conf.input.update(ticks);
  };

  return player;
};
