(function () { // module pattern
  'use strict';
  var inputFactory = require('./scripts/input'),
    playerFactory = require('./scripts/player'),
    replayFactory = require('./scripts/replay'),
    assets = require('./scripts/assets'),
    world = require('./scripts/world'),
    KEY = require('./scripts/keys');

  var input = inputFactory();
  var replayRecording = replayFactory(input);
  var replayInput = replayFactory();

  var setup = function (map) {
    var data = map.layers[0].data,
      objects = map.layers[1].objects,
      n, obj;

    for (n = 0; n < objects.length; n++) {
      obj = objects[n];
      if (obj.type === 'player') {
        world.addPlayer(playerFactory({
          input: (input),
          obj: obj
        }));
      }
      world.clear();
    }

    world.addBlocks(data);
  };

  $(world).on('world.update', function (e, ticks) {
    input.update(ticks);
    replayInput.update(ticks);

    if (ticks === 2500) {
      world.clear();
    }

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

  $(document).ready(function () {
    assets.load();
    $(assets).on('assets.loaded', function () {
      $.get('level.json', function (req) {
        if (req.layers) {
          setup(req); // from a webserver the response is parsed already
        } else {
          setup(JSON.parse(req));
        }
      });
    });
  });

})();
