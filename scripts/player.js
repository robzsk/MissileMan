'use strict';

var METER = 1,
  GRAVITY = -9.8 * 6, // default (exagerated) gravity
  MAXDX = 15, // default max horizontal speed (15 tiles per second)
  MAXDY = 60, // default max vertical speed   (60 tiles per second)
  ACCEL = 1 / 2, // default take 1/2 second to reach maxdx (horizontal acceleration)
  FRICTION = 1 / 6, // default take 1/6 second to stop from maxdx (horizontal friction)
  IMPULSE = 1500;

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

  var bound = function (x, min, max) {
    return Math.max(min, Math.min(max, x));
  };
  var updatePhysics = function (dt) {
    var wasleft = player.dx < 0,
      wasright = player.dx > 0,
      falling = player.falling,
      friction = player.friction * (falling ? 0.5 : 1),
      accel = player.accel * (falling ? 0.5 : 1);
    player.ddx = 0;
    player.ddy = player.gravity;

    if (player.left) {
      player.ddx = player.ddx - accel;
    }
    else if (wasleft) {
      player.ddx = player.ddx + friction;
    }

    if (player.right) {
      player.ddx = player.ddx + accel;
    }
    else if (wasright) {
      player.ddx = player.ddx - friction;
    }

    if (player.jump && !player.jumping && !falling) {
      player.ddy = player.ddy + player.impulse;
      player.jumping = true;
    }

    player.x = player.x + (dt * player.dx);
    player.y = player.y + (dt * player.dy);
    player.dx = bound(player.dx + (dt * player.ddx), -player.maxdx, player.maxdx);
    player.dy = bound(player.dy + (dt * player.ddy), -player.maxdy, player.maxdy);

    if ((wasleft && (player.dx > 0)) ||
      (wasright && (player.dx < 0))) {
      player.dx = 0; // clamp at zero to prevent friction from making us jiggle side to side
    }
  };

  player.update = function (ticks, dt) {
    conf.input.update(ticks);
    updatePhysics(dt);
  };

  return player;
};
