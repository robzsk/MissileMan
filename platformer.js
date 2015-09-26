(function () { // module pattern
  'use strict';
  var inputFactory = require('./scripts/input'),
    playerFactory = require('./scripts/player'),
    replayFactory = require('./scripts/replay'),
    sceneFactory = require('./scripts/scene'),
    KEY = require('./scripts/keys');

  var input = inputFactory();
  var replayRecording = replayFactory(input);
  var replayInput = replayFactory();
  var scene = sceneFactory($('#canvas'));

  function timestamp () {
    return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
  }

  function bound (x, min, max) {
    return Math.max(min, Math.min(max, x));
  }

  function overlap (x1, y1, w1, h1, x2, y2, w2, h2) {
    return !(((x1 + w1 - 1) < x2) ||
    ((x2 + w2 - 1) < x1) ||
    ((y1 + h1 - 1) < y2) ||
    ((y2 + h2 - 1) < y1));
  }

  var MAP = { tw: 64, th: 48 },
    TILE = 1,
    COLOR = { BLACK: '#000000', YELLOW: '#ECD078', BRICK: '#D95B43', PINK: '#C02942', PURPLE: '#542437', GREY: '#333', SLATE: '#53777A', GOLD: 'gold' },
    COLORS = [ COLOR.YELLOW, COLOR.BRICK, COLOR.PINK, COLOR.PURPLE, COLOR.GREY ];

  var fps = 60,
    step = 1 / fps,
    players = [],
    avatars = [], // render
    cells = [];

  var createCube = function (color, size) {
    return function (s) {
      var geometry = new THREE.BoxGeometry(s.x, s.y, s.z),
        material = new THREE.MeshLambertMaterial({
          color: color
        }),
        cube = new THREE.Mesh(geometry, material);
      return cube;
    }(size || {x: TILE, y: TILE, z: TILE});
  };

  var tcell = function (tx, ty) { return cells[tx + (ty * MAP.tw)];},
    ty = function (y) { return MAP.th - y;}; // little hack to show y position in 3d space instead of canvas space

  var ticks = 0;
  var update = function (dt) {
    ticks += 1;
    input.update(ticks);
    replayInput.update(ticks);

    _.each(players, function (p) {
      updateEntity(p, dt);
    });

    // --temporary stuffs
    if (ticks === 250) {
      var tmp = JSON.parse(replayRecording.serialize());
      if (_.size(tmp) > 0) {
        replayInput = replayFactory();
        replayInput.deserialize(tmp);
        // not safe but we're testing
        players[1].setInput(replayInput);
      }
      replayRecording.reset();
      ticks = 0;
      killPlayers();
    }
    // --

  };

  var killPlayers = function () {
    _.each(players, function (p) {
      p.x = p.start.x;
      p.y = p.start.y;
      p.dx = p.dy = 0;
    });
  };

  var updateEntity = function (entity, dt) {
    var wasleft = entity.dx < 0,
      wasright = entity.dx > 0,
      falling = entity.falling,
      friction = entity.friction * (falling ? 0.5 : 1),
      accel = entity.accel * (falling ? 0.5 : 1);

    entity.ddx = 0;
    entity.ddy = entity.gravity;

    if (entity.left) {
      entity.ddx = entity.ddx - accel;
    }
    else if (wasleft) {
      entity.ddx = entity.ddx + friction;
    }

    if (entity.right) {
      entity.ddx = entity.ddx + accel;
    }
    else if (wasright) {
      entity.ddx = entity.ddx - friction;
    }

    if (entity.jump && !entity.jumping && !falling) {
      entity.ddy = entity.ddy - entity.impulse; // an instant big force impulse
      entity.jumping = true;
    }

    entity.x = entity.x + (dt * entity.dx);
    entity.y = entity.y + (dt * entity.dy);
    entity.dx = bound(entity.dx + (dt * entity.ddx), -entity.maxdx, entity.maxdx);
    entity.dy = bound(entity.dy + (dt * entity.ddy), -entity.maxdy, entity.maxdy);

    if ((wasleft && (entity.dx > 0)) ||
      (wasright && (entity.dx < 0))) {
      entity.dx = 0; // clamp at zero to prevent friction from making us jiggle side to side
    }

    var tx = Math.floor(entity.x),
      ty = Math.floor(entity.y),
      nx = entity.x % TILE,
      ny = entity.y % TILE,
      cell = tcell(tx, ty),
      cellright = tcell(tx + 1, ty),
      celldown = tcell(tx, ty + 1),
      celldiag = tcell(tx + 1, ty + 1);

    if (entity.dy > 0) {
      if ((celldown && !cell) ||
        (celldiag && !cellright && nx)) {
        entity.y = ty;
        entity.dy = 0;
        entity.falling = false;
        entity.jumping = false;
        ny = 0;
      }
    }
    else if (entity.dy < 0) {
      if ((cell && !celldown) ||
        (cellright && !celldiag && nx)) {
        entity.y = ty + 1;
        entity.dy = 0;
        cell = celldown;
        cellright = celldiag;
        ny = 0;
      }
    }

    if (entity.dx > 0) {
      if ((cellright && !cell) ||
        (celldiag && !celldown && ny)) {
        entity.x = tx;
        entity.dx = 0;
      }
    }
    else if (entity.dx < 0) {
      if ((cell && !cellright) ||
        (celldown && !celldiag && ny)) {
        entity.x = tx + 1;
        entity.dx = 0;
      }
    }

    entity.falling = ! (celldown || (nx && celldiag));

  };

  var setup = function (map) {
    var data = map.layers[0].data,
      objects = map.layers[1].objects,
      n, obj;

    for (n = 0; n < objects.length; n++) {
      obj = objects[n];
      if (obj.type === 'player') {
        players.push(playerFactory({
          input: (players.length === 0 ? input : {}),
          obj: obj
        }));
        avatars.push(createCube(COLOR.YELLOW));
        scene.add(avatars[avatars.length - 1]);
      }
    }

    cells = data;
    +function () {
      var x, y, cell, cube;
      for (y = 0; y < MAP.th; y++) {
        for (x = 0; x < MAP.tw; x++) {
          cell = tcell(x, y);
          if (cell) {
            cube = createCube(COLORS[cell - 1]);
            cube.position.set(x * TILE, ty(y * TILE), 0);
            scene.add(cube);
          }
        }
      }
    }();
  };

  var renderPlayer = function (p, a, dt) {
    a.position.set(p.x + (p.dx * dt), ty(p.y + (p.dy * dt)), 0);
  };
  var render = function (dt) {
    _.each(players, function (p, i) {
      renderPlayer(p, avatars[i], dt);
    });
  };

  var counter = 0, dt = 0, now,
    last = timestamp(),
    fpsmeter = new FPSMeter({ decimals: 0, graph: true, theme: 'dark', left: '5px' });

  $(scene).on('scene.render', function () {
    fpsmeter.tickStart();
    now = timestamp();
    dt = dt + Math.min(1, (now - last) / 1000);
    while(dt > step) {
      dt = dt - step;
      update(step);
    }
    render(dt);
    last = now;
    counter++;
    fpsmeter.tick();

    if (avatars[0])
      scene.follow(avatars[0].position); // unsafe for tests only
  });

  var onkey = function (ev, key, down) {
    switch (key) {
      case KEY.LEFT:
        input.setLeft(down);
        ev.preventDefault();
        return false;
      case KEY.RIGHT:
        input.setRight(down);
        ev.preventDefault();
        return false;
      case KEY.UP:
        input.setJump(down);
        ev.preventDefault();
        return false;
    }
  };

  document.addEventListener('keydown', function (ev) { return onkey(ev, ev.keyCode, true);  }, false);
  document.addEventListener('keyup', function (ev) { return onkey(ev, ev.keyCode, false); }, false);

  $.get('level.json', function (req) {
    setup(JSON.parse(req));
  });

})();
