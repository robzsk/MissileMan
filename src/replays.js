'use strict';

var _ = require('underscore'),
  Input = require('./engine/input'),
  Player = require('./player'),
  storage = require('./storage');

module.exports = function () {
  var playerInput = new Input({ keys: { left: 37, right: 39, jump: 38, morph: 67 } }),
    replays = [],
    currentPlayer = 0,
    spawnPoints,
    playerInput,
    demo = true;

  var createCurrentPlayer = function () {
    replays.push({
      spawn: spawnPoints[currentPlayer],
      input: playerInput
    });
  };

  var incCurrentPlayer = function () {
    currentPlayer += 1;
    if (currentPlayer >= spawnPoints.length) {
      currentPlayer = 0;
    }
  };

  return {
    init: function (sp) {
      spawnPoints = sp;
    },

    reset: function () {
      replays = [];
      currentPlayer = 0;
    },

    reload: function () {
      replays = storage.replays();
      currentPlayer = 0;
    },

    getCurrentPlayer: function () {
      return currentPlayer;
    },

    save: function () {
      if (!demo) {
        storage.replays(replays);
      }
    },

    next: function () {
      if (!demo) {
        replays[currentPlayer].input = new Input({replay: playerInput.serialize()});
        playerInput.reset();
      }
      incCurrentPlayer();
      if (!replays[currentPlayer]) {
        createCurrentPlayer();
      } else {
        if (!demo) {
          replays[currentPlayer].input = playerInput;
        }
      }
    },

    setDemo: function (d) {
      demo = d;
    },

    getPlayers: function () {
      var players = [];
      // must have at least one replay
      if (replays.length === 0) {
        createCurrentPlayer();
      }
      _.each(replays, function (r, n) {
        // world.addPlayer(new Player(r), n === currentPlayer);
        players.push(new Player(r));
      });
      return players;
    }
  };

}();
