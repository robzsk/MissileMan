(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function () {
  'use strict';

  var DEFAULT_LEVEL = 'level.json';

  var inputFactory = require('./scripts/input'),
    playerFactory = require('./scripts/player'),
    replayFactory = require('./scripts/replay'),
    assets = require('./scripts/assets'),
    world = require('./scripts/world'),
    KEY = require('./scripts/keys');

  var player,
    spawn, // temporary player spawner
    input = inputFactory(),
    replayRecording = replayFactory(input),
    replays = [];

  var setup = function (map) {
    var data = map.layers[0].data,
      objects = map.layers[1].objects,
      n, obj;

    for (n = 0; n < objects.length; n++) {
      obj = objects[n];
      if (obj.type === 'player') {
        spawn = obj; // temporary
        player = playerFactory({
          input: input,
          obj: obj
        });
        world.addPlayer(player);
      } else if (obj.type === 'target') {
        world.addTarget({
          x: obj.x, y: obj.y
        });
      }
    }

    world.addBlocks(data);
  };

  var loadWorld = function (levelFile) {
    var loadLevel = function (callback) {
        $.get(levelFile, function (req) {
          if (req.layers) {
            setup(req); // from a webserver the response is parsed already
          } else {
            setup(JSON.parse(req));
          }
          callback();
        });
      },
      addReplays = function () {
        _.each(replays, function (r) {
          world.addPlayer(playerFactory({
            input: r,
            obj: spawn
          }));
        });
      };
    world.clear();
    loadLevel(addReplays);
  };

  $(world).on('world.update', function (e, ticks) {
    input.update(ticks);
    _.each(replays, function (r) {
      r.update(ticks);
    });
  });

  $(world).on('world.target.destroyed', function (e, p) {
    var replayInput;
    if (player === p) {
      replayInput = replayFactory();
      replayInput.deserialize(JSON.parse(replayRecording.serialize())); // TODO: use a copy from method? meantime this is a good unit test
      replays.push(replayInput);
      replayRecording.reset();
      loadWorld(DEFAULT_LEVEL);
    }
  });

  var inputHandler = function () {
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
  }();

  $(document).ready(function () {
    assets.load();
    $(assets).on('assets.loaded', function () {
      loadWorld(DEFAULT_LEVEL);
    });
  });

})();

},{"./scripts/assets":2,"./scripts/input":3,"./scripts/keys":4,"./scripts/player":5,"./scripts/replay":6,"./scripts/world":8}],2:[function(require,module,exports){
'use strict';

module.exports = function () {
  var mesh = {};

  var createCube = function (color) {
    var geometry = new THREE.BoxGeometry(1, 1, 1),
      material = new THREE.MeshBasicMaterial({ color: color }),
      cube = new THREE.Mesh(geometry, material);
    return cube;
  };

  return {
    load: function () {
      var manager = new THREE.LoadingManager(),
        loader = new THREE.JSONLoader(manager);
      var loadMesh = function (name, mf) {
        loader.load('assets/' + mf + '.json', function (geom) {
          mesh[name] = new THREE.Mesh(geom, new THREE.MeshDepthMaterial());
        });
      };
      var me = this;
      manager.onLoad = function () {
        $(me).trigger('assets.loaded');
      };

      loadMesh('empty', 'empty');
      loadMesh('solid', 'solid');
    },

    // TODO: rename these or group them...
    cubeEmpty: function (n) {
      return mesh['empty'].clone();
    },

    cubeSolid: function () {
      return mesh['solid'].clone();
    },

    cubeTarget: function () {
      return createCube(0xac4442);
    },

    cubePlayer: function () {
      return createCube(0x0179d5);
    }

  };
}();

},{}],3:[function(require,module,exports){
'use strict';

module.exports = function () {
  var moves = [],
    lastLeft = false,
    lastRight = false,
    lastJump = false,
    left = false,
    right = false,
    jump = false;

  var input = {
    setLeft: function (down) {
      left = down;
    },

    setRight: function (down) {
      right = down;
    },

    setJump: function (down) {
      jump = down;
    },

    update: function (tick) {
      var move;
      if (lastLeft !== left || lastRight !== right || lastJump !== jump) {
        $(input).trigger('input.move', {left: left,right: right,jump: jump,tick: tick});
        lastLeft = left;
        lastRight = right;
        lastJump = jump;
      }
    }

  };

  return input;
};

},{}],4:[function(require,module,exports){
module.exports = {
  SPACE: 32,
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40
};

},{}],5:[function(require,module,exports){
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
  player.jump = false;
  player.start = { x: obj.x, y: obj.y };
  player.killed = 0;

  player.reset = function () {
    player.jump = player.left = player.right = false;
    player.killed = 0;
    player.dx = player.dy = 0;
    player.x = player.start.x;
    player.y = player.start.y;
  };

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

},{}],6:[function(require,module,exports){
'use strict';

module.exports = function (input) {
  var moves = {};

  if (input) {
    $(input).on('input.move', function (e, m) {
      moves['_' + m.tick] = m;
    });
  }

  var replay = {
    reset: function () {
      moves = {};
    },

    deserialize: function (file) {
      moves = file;
    },
    serialize: function () {
      var file = JSON.stringify(moves);
      return file;
    },

    update: function (tick) {
      var m = moves['_' + tick];
      if (m) {
        $(replay).trigger('input.move', m);
      }
    }
  };
  return replay;
};

},{}],7:[function(require,module,exports){
var zoom = 26;

module.exports = function (canvas) {
  'use strict';

  var stats = function () {
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

  var ret,
    scene = new THREE.Scene(),
    cam = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, zoom - 9, zoom),
    // dlight = new THREE.DirectionalLight(0xffffff, 1),
    alight = new THREE.AmbientLight(0xffffff),
    renderer = new THREE.WebGLRenderer();

  cam.position.set(0, 0, zoom);
  cam.updateProjectionMatrix();

  scene.add(cam);
  // scene.add(dlight);
  scene.add(alight);

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x3e3e3e, 1);
  $('body').append(renderer.domElement);

  +function render () {
    stats.begin();
    requestAnimationFrame(render);
    $(ret).trigger('scene.render');
    renderer.render(scene, cam);
    stats.end();
  }();

  ret = {
    add: function (m) {
      scene.add(m);
    },
    follow: function (p) {
      cam.position.set(p.x, p.y, zoom);
    },
    remove: function (m) {
      scene.remove(m);
    },
    clear: function () {
      var children = _.clone(scene.children);
      _.each(children, function (child) {
        scene.remove(child);
      });
    }
  };
  return ret;
};

},{}],8:[function(require,module,exports){
module.exports = function () {
  'use strict';
  var world;
  var MAP = { tw: 64, th: 48 },
    TILE = 1;

  var players = [],
    targets = [],
    cells = [];

  var assets = require('./assets'),
    sceneFactory = require('./scene');

  var scene = sceneFactory($('#canvas'));

  var timestamp = function () {
    return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
  };

  var bound = function (x, min, max) {
    return Math.max(min, Math.min(max, x));
  };

  var tcell = function (tx, ty) { return cells[tx + (ty * MAP.tw)];};
  var ty = function (y) { return MAP.th - y;}; // little hack to show y position in 3d space instead of canvas space

  var overlap = function (x1, y1, w1, h1, x2, y2, w2, h2) {
    return !(((x1 + w1) < x2) ||
    ((x2 + w2) < x1) ||
    ((y1 + h1) < y2) ||
    ((y2 + h2) < y1));
  };

  var render = function (dt) {
    _.each(players, function (p) {
      p.avatar.position.set(p.x + (p.dx * dt), ty(p.y + (p.dy * dt)), 0);
    });
  };

  var collideTargets = function (entity) {
    _.each(targets, function (t) {
      if (overlap(entity.x, entity.y, 1, 1, t.x, t.y, 1, 1)) {
        // TODO: send out the target too? need to be safe not to remove the target in this loop
        $(world).trigger('world.target.destroyed', entity);
      }
    });
  };

  var collideCells = function (entity) {
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

  var updatePlayer = function (entity, dt) {
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

    collideCells(entity);
    collideTargets(entity);
  };

  var step = 1 / 60,
    dt = 0,
    now,
    last = timestamp();

  var ticks = 0;
  var update = function (dt) {
    $(world).trigger('world.update', ticks);
    ticks += 1;
    _.each(players, function (p) {
      updatePlayer(p, dt);
    });
  };

  $(scene).on('scene.render', function () {
    now = timestamp();
    dt = dt + Math.min(1, (now - last) / 1000);
    while(dt > step) {
      dt = dt - step;
      update(step);
    }
    render(dt);
    last = now;

    if (players[0]) {
      scene.follow(players[0].avatar.position);
    }
  });

  world = {
    clear: function () {
      ticks = 0;
      players = [];
      targets = [];
      cells = [];
      scene.clear();
    },

    addTarget: function (target) {
      var cube = assets.cubeTarget();
      targets.push(target);
      cube.position.set(target.x, ty(target.y), 0);
      scene.add(cube);
    },

    addPlayer: function (player) {
      players.push(player);
      player.avatar = assets.cubePlayer();
      scene.add(player.avatar);
    },

    addBlocks: function (blocks) {
      cells = blocks;
      var x, y, cell, cube;
      for (y = 0; y < MAP.th; y++) {
        for (x = 0; x < MAP.tw; x++) {
          cell = tcell(x, y);
          if (cell === 1) {
            cube = assets.cubeSolid();
          } else {
            cube = assets.cubeEmpty();
          }
          cube.position.set(x, ty(y), 0);
          scene.add(cube);
        }
      }
    }

  };
  return world;
}();

},{"./assets":2,"./scene":7}]},{},[1]);
