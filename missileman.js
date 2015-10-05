(function () {
  'use strict';

  var DEFAULT_LEVEL = 'level.json';

  var overlay = require('./scripts/overlay'),
    inputFactory = require('./scripts/input'),
    playerFactory = require('./scripts/player'),
    assets = require('./scripts/assets'),
    world = require('./scripts/world'),
    loop = require('./scripts/loop');

  var players = [],
    spawnPoints = [],
    currentPlayer = 0,
    playerInput = inputFactory({ keys: { left: 37, right: 39, jump: 38 } }),
    overlayInput = inputFactory({ keys: { up: 38, down: 40, select: 13 } });

  var setup = function (map) {
    var data = map.layers[0].data,
      objects = map.layers[1].objects,
      n, obj;

    spawnPoints = [];

    for (n = 0; n < objects.length; n++) {
      obj = objects[n];
      if (obj.type === 'player') {
        spawnPoints.push(obj);
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
    };
    var addPlayers = function () {
      if (players.length === 0) {
        players[currentPlayer] = playerFactory({
          input: playerInput,
          obj: spawnPoints[currentPlayer]
        });
      }
      playerInput.reset();
      _.each(players, function (p) {
        p.reset();
        world.addPlayer(p, p === players[currentPlayer]);
      });

    };
    world.clear();
    loop.reset();
    loadLevel(addPlayers);
  };

  $(world).on('world.player.killed', function (e, p) {
    if (players[currentPlayer] === p) {
      players[currentPlayer].detatchInput();
      players[currentPlayer] = playerFactory({
        input: inputFactory({replay: playerInput.serialize()}),
        obj: spawnPoints[currentPlayer]
      });

      currentPlayer += 1;
      if (currentPlayer >= spawnPoints.length) {
        currentPlayer = 0;
      }

      // move to the next spawn point
      if (players[currentPlayer]) {
        players[currentPlayer].detatchInput();
      }
      players[currentPlayer] = playerFactory({
        input: playerInput,
        obj: spawnPoints[currentPlayer]
      });

      setTimeout(function () {
        if (world.isComplete()) {
          overlay.showTitle(overlayInput);
        } else {
          overlay.fadeFromBlack();
          loadWorld(DEFAULT_LEVEL);
        }
      }, 1000);

    }
  });

  $(overlay).on('title.playbutton.click', function () {
    overlay.hideTitle();
    overlay.fadeFromBlack();

    _.each(players, function (p) {
      p.detatchInput();
    });
    players = [];
    currentPlayer = 0;
    loadWorld(DEFAULT_LEVEL);

  });

  $(document).ready(function () {
    assets.load();
    $(assets).on('assets.loaded', function () {
      overlay.fadeFromBlack();
      overlay.showTitle(overlayInput);
    });
  });

  $(loop).on('loop.update', function (e, ticks, step) {
    overlayInput.update(ticks);
    _.each(players, function (p) {
      p.update(ticks);
    });
    world.update(step);
  });

  $(loop).on('loop.render', function (e, dt) {
    world.render(dt);
  });

})();
