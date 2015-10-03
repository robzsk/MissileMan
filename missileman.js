(function () {
  'use strict';

  var DEFAULT_LEVEL = 'level.json';

  var overlay = require('./scripts/overlay'),
    inputFactory = require('./scripts/input'),
    playerFactory = require('./scripts/player'),
    replayFactory = require('./scripts/replay'),
    assets = require('./scripts/assets'),
    world = require('./scripts/world'),
    KEY = require('./scripts/keys');

  overlay.fadeFromBlack();

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

  $(world).on('world.player.killed', function (e, p) {
    var replayInput;
    if (player === p) { // TODO: or if world isComplete
      replayInput = replayFactory();
      replayInput.deserialize(JSON.parse(replayRecording.serialize())); // TODO: use a copy from method? meantime this is a good unit test
      replays.push(replayInput);
      setTimeout(function () {
        if (world.isComplete()) {
          replays = [];
        }
        replayRecording.reset();
        loadWorld(DEFAULT_LEVEL);
        overlay.fadeFromBlack();
      }, 1000);
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
