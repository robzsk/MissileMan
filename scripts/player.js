'use strict';

var METER = 32,
  GRAVITY = 9.8 * 6, // default (exagerated) gravity
  MAXDX = 15, // default max horizontal speed (15 tiles per second)
  MAXDY = 60, // default max vertical speed   (60 tiles per second)
  ACCEL = 1 / 2, // default take 1/2 second to reach maxdx (horizontal acceleration)
  FRICTION = 1 / 6, // default take 1/6 second to stop from maxdx (horizontal friction)
  IMPULSE = 1500; // default player jump impulse

module.exports = function (conf) {
  var obj = conf.obj;
  var player = {};
  player.x = obj.x;
  player.y = obj.y;
  player.dx = 0;
  player.dy = 0;
  player.gravity = METER * (obj.properties.gravity || GRAVITY);
  player.maxdx = METER * (obj.properties.maxdx || MAXDX);
  player.maxdy = METER * (obj.properties.maxdy || MAXDY);
  player.impulse = METER * (obj.properties.impulse || IMPULSE);
  player.accel = player.maxdx / (obj.properties.accel || ACCEL);
  player.friction = player.maxdx / (obj.properties.friction || FRICTION);
  player.player = obj.type == 'player';
  player.left = obj.properties.left;
  player.right = obj.properties.right;
  player.start = { x: obj.x, y: obj.y };
  player.killed = 0;

  player.setInput = function (i) {
    $(i).on('input.move', function (e, m) {
      player.left = m.left;
      player.right = m.right;
      player.jump = m.jump;
    });
  };

  if (conf.input) {
    player.setInput(conf.input);
  }

  return player;
};
