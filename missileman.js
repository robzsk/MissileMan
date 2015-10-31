(function () {
  'use strict';

  const DEFAULT_LEVEL = 'level.json';

  const _ = require('underscore'),
    Overlay = require('./src/overlay'),
    Input = require('./src/engine/input'),
    Player = require('./src/player'),
    World = require('./src/world'),
    assets = require('./src/assets'),
    loop = require('./src/engine/loop'),
    storage = require('./src/storage');

  var overlay = new Overlay(),
    world = new World(),
    spawnPoints,
    playerInput = new Input({ keys: { left: 37, right: 39, jump: 38, morph: 67 } }),
    demo = true,
    overlayInput = new Input({ keys: { up: 38, down: 40, select: 13 } });

  var loadLevelFromFile = function () {
    var setup = function (level) {
      spawnPoints = level.spawnPoints;
      world.addBlocks(level.cells);
    };
    return function (levelFile, callback) {
      world.clear();
      $.get(levelFile, function (req) {
        if (req.cells) {
          setup(req); // from a webserver the response is parsed already
        } else {
          setup(JSON.parse(req));
        }
        callback();
      });
    };
  }();

  var createCurrentPlayer = function () {
    replays.push({
      // assumed level is already loaded
      // assumed currentPlayer is less than spawnPoints.length
      spawn: spawnPoints[currentPlayer],
      input: playerInput
    });
  };

  var replays = [];
  var currentPlayer = 0;
  var setupPlayers = function () {
    // must have at least one replay
    if (replays.length === 0) {
      createCurrentPlayer();
    }
    // add the players to the level
    _.each(replays, function (r, n) {
      world.addPlayer(new Player(r), n === currentPlayer);
    });

  };

  var startLevel = function () {
    loop.reset();
    replays = [];
    currentPlayer = 0;
    setupPlayers();
  };

  var showTitle = function () {
    loop.reset();
    replays = storage.replays();
    currentPlayer = 0;
    demo = true;
    loadLevelFromFile(DEFAULT_LEVEL, setupPlayers);
    overlay.fadeFromBlack();
    overlay.showTitle(overlayInput);
  };

  world.on('world.player.killed', function (player) {
    if (world.isComplete()) {
      storage.replays(replays);
    }

    if (!demo) {
      replays[currentPlayer].input = new Input({replay: playerInput.serialize()});
      playerInput.reset();
    }

    currentPlayer += 1;
    if (currentPlayer >= spawnPoints.length) {
      currentPlayer = 0;
    }
    if (!replays[currentPlayer]) {
      createCurrentPlayer();
    } else {
      if (!demo) {
        replays[currentPlayer].input = playerInput;
      }
    }
    setTimeout(function () {
      if (world.isComplete()) {
        showTitle();
      } else {
        overlay.fadeFromBlack();
        loop.reset();
        loadLevelFromFile(DEFAULT_LEVEL, setupPlayers);
      }
    }, 20);
  });

  overlay.on('title.playbutton.click', function () {
    demo = false;
    overlay.hideTitle();
    overlay.fadeFromBlack();
    loadLevelFromFile(DEFAULT_LEVEL, startLevel);
  });

  $(document).ready(function () {
    assets.load(showTitle);
  });

  loop.on('loop.update', function (ticks, step) {
    overlayInput.update(ticks);
    world.update(ticks, step);
  });

  loop.on('loop.render', function (dt) {
    world.render(dt);
  });
})();
