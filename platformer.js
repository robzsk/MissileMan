(function () { // module pattern
  var inputFactory = require('./scripts/input'),
    playerFactory = require('./scripts/player'),
    replayFactory = require('./scripts/replay'),
    KEY = require('./scripts/keys');

  var input = inputFactory();
  var replayRecording = replayFactory(input);
  var replayInput = replayFactory();

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
    TILE = 32,
    COLOR = { BLACK: '#000000', YELLOW: '#ECD078', BRICK: '#D95B43', PINK: '#C02942', PURPLE: '#542437', GREY: '#333', SLATE: '#53777A', GOLD: 'gold' },
    COLORS = [ COLOR.YELLOW, COLOR.BRICK, COLOR.PINK, COLOR.PURPLE, COLOR.GREY ];

  var fps = 60,
    step = 1 / fps,
    canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    width = canvas.width = MAP.tw * TILE,
    height = canvas.height = MAP.th * TILE,
    // player = {},
    players = [],
    cells = [];

  var t2p = function (t) { return t * TILE;},
    p2t = function (p) { return Math.floor(p / TILE);},
    cell = function (x, y) { return tcell(p2t(x), p2t(y));},
    tcell = function (tx, ty) { return cells[tx + (ty * MAP.tw)];};

  var ticks = 0;
  var update = function (dt) {
    ticks += 1;
    input.update(ticks);
    replayInput.update(ticks);

    _.each(players, function (p) {
      updateEntity(p, dt);
    });

    // --temporary stuffs
    if (ticks === 100) {
      var tmp = JSON.parse(replayRecording.serialize());
      if (_.size(tmp) > 0) {
        replayInput = replayFactory();
        replayInput.deserialize(tmp);
        // not safe but we're testing
        players[1].setInput(replayInput);
        console.log(replayRecording.serialize());
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

  function updateEntity (entity, dt) {
    var wasleft = entity.dx < 0,
      wasright = entity.dx > 0,
      falling = entity.falling,
      friction = entity.friction * (falling ? 0.5 : 1),
      accel = entity.accel * (falling ? 0.5 : 1);

    entity.ddx = 0;
    entity.ddy = entity.gravity;

    if (entity.left)
      entity.ddx = entity.ddx - accel;
    else if (wasleft)
      entity.ddx = entity.ddx + friction;

    if (entity.right)
      entity.ddx = entity.ddx + accel;
    else if (wasright)
      entity.ddx = entity.ddx - friction;

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

    var tx = p2t(entity.x),
      ty = p2t(entity.y),
      nx = entity.x % TILE,
      ny = entity.y % TILE,
      cell = tcell(tx, ty),
      cellright = tcell(tx + 1, ty),
      celldown = tcell(tx, ty + 1),
      celldiag = tcell(tx + 1, ty + 1);

    if (entity.dy > 0) {
      if ((celldown && !cell) ||
        (celldiag && !cellright && nx)) {
        entity.y = t2p(ty);
        entity.dy = 0;
        entity.falling = false;
        entity.jumping = false;
        ny = 0;
      }
    }
    else if (entity.dy < 0) {
      if ((cell && !celldown) ||
        (cellright && !celldiag && nx)) {
        entity.y = t2p(ty + 1);
        entity.dy = 0;
        cell = celldown;
        cellright = celldiag;
        ny = 0;
      }
    }

    if (entity.dx > 0) {
      if ((cellright && !cell) ||
        (celldiag && !celldown && ny)) {
        entity.x = t2p(tx);
        entity.dx = 0;
      }
    }
    else if (entity.dx < 0) {
      if ((cell && !cellright) ||
        (celldown && !celldiag && ny)) {
        entity.x = t2p(tx + 1);
        entity.dx = 0;
      }
    }

    entity.falling = ! (celldown || (nx && celldiag));

  }

  function render (ctx, frame, dt) {
    ctx.clearRect(0, 0, width, height);
    renderMap(ctx);
    _.each(players, function (p) {
      renderPlayer(p, ctx, dt);
    });
  }

  function renderMap (ctx) {
    var x, y, cell;
    for (y = 0; y < MAP.th; y++) {
      for (x = 0; x < MAP.tw; x++) {
        cell = tcell(x, y);
        if (cell) {
          ctx.fillStyle = COLORS[cell - 1];
          ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
        }
      }
    }
  }

  function renderPlayer (p, ctx, dt) {
    ctx.fillStyle = COLOR.YELLOW;
    ctx.fillRect(p.x + (p.dx * dt), p.y + (p.dy * dt), TILE, TILE);
  }

  function setup (map) {
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
      }
    }

    cells = data;
  }

  var counter = 0, dt = 0, now,
    last = timestamp(),
    fpsmeter = new FPSMeter({ decimals: 0, graph: true, theme: 'dark', left: '5px' });

  function frame () {
    fpsmeter.tickStart();
    now = timestamp();
    dt = dt + Math.min(1, (now - last) / 1000);
    while(dt > step) {
      dt = dt - step;
      update(step);
    }
    render(ctx, counter, dt);
    last = now;
    counter++;
    fpsmeter.tick();

    requestAnimationFrame(frame, canvas);
  }

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
    frame();
  });

})();
