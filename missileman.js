(function () {
  'use strict';

  const DEFAULT_LEVEL = 'level.json';

  const _ = require('underscore'),
    Overlay = require('./src/overlay'),
    Input = require('./src/engine/input'),
    World = require('./src/world'),
    assets = require('./src/assets'),
    loop = require('./src/engine/loop'),
    replays = require('./src/replays');

  var overlay = new Overlay(),
    world = new World(),
    spawnPoints,
    overlayInput = new Input({ keys: { up: 38, down: 40, select: 13 } });

  var loadLevelFromFile = function () {
    var setup = function (level) {
      replays.init(level.spawnPoints);
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

  var setupPlayers = function () {
    _.each(replays.getPlayers(), function (p, n) {
      world.addPlayer(p, n === replays.getCurrentPlayer());
    });
  };

  var startLevel = function () {
    loop.reset();
    replays.reset();
    setupPlayers();
  };

  var showTitle = function () {
    loop.reset();
    replays.reload();
    replays.setDemo(true);
    loadLevelFromFile(DEFAULT_LEVEL, setupPlayers);
    overlay.fadeFromBlack();
    overlay.showTitle(overlayInput);
  };

  world.on('world.player.killed', function (player) {
    if (world.isComplete()) {
      replays.save();
    }

    replays.next();

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
    replays.setDemo(false);
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
