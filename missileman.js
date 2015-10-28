(function () {
  'use strict';

  const DEFAULT_LEVEL = 'level.json';

  const Overlay = require('./src/overlay'),
    Input = require('./src/input'),
    Player = require('./src/player'),
    World = require('./src/world'),
    assets = require('./src/assets'),
    loop = require('./src/engine/loop');

  var overlay = new Overlay(),
    world = new World(),
    players = [],
    spawnPoints = [],
    currentPlayer = 0,
    playerInput = new Input({ keys: { left: 37, right: 39, jump: 38, morph: 67 } }),
    overlayInput = new Input({ keys: { up: 38, down: 40, select: 13 } });

  const setup = function (map) {
    spawnPoints = map.spawnPoints;
    _.each(map.targets, function (t) {
      world.addTarget(t);
    });

    world.addBlocks(map.cells);
  };

  const loadWorld = function (levelFile) {
    const loadLevel = function (callback) {
      $.get(levelFile, function (req) {
        if (req.cells) {
          setup(req); // from a webserver the response is parsed already
        } else {
          setup(JSON.parse(req));
        }
        callback();
      });
    };
    const addPlayers = function () {
      if (players.length === 0) {
        players[currentPlayer] = new Player({
          input: playerInput,
          pos: spawnPoints[currentPlayer]
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

  world.on('world.player.killed', function (p) {
    if (players[currentPlayer] === p) {
      players[currentPlayer].detatchInput();
      players[currentPlayer] = new Player({
        input: new Input({replay: playerInput.serialize()}),
        pos: spawnPoints[currentPlayer]
      });

      currentPlayer += 1;
      if (currentPlayer >= spawnPoints.length) {
        currentPlayer = 0;
      }

      // move to the next spawn point
      if (players[currentPlayer]) {
        players[currentPlayer].detatchInput();
      }
      players[currentPlayer] = new Player({
        input: playerInput,
        pos: spawnPoints[currentPlayer]
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

  overlay.on('title.playbutton.click', function () {
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
    assets.on('assets.loaded', function () {
      overlay.fadeFromBlack();
      overlay.showTitle(overlayInput);
    });
  });

  loop.on('loop.update', function (ticks, step) {
    overlayInput.update(ticks);
    world.update(ticks, step);
  });

  loop.on('loop.render', function (dt) {
    world.render(dt);
  });

})();
