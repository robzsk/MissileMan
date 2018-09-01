const THREE = require('three');
const events = require('minivents');
const { PLAYER, WALL, MISSILE, SWITCH, TARGET } = require('./mask');

const color = new THREE.Color('rgb(55, 116, 196)');
const createPlayer = require('./player');
const createMap = require('./map');
const sound = require('./../sound');

module.exports = scene => {
  let map;
  let targets = [];
  let switches = [];
  let players = [];

  const api = {};

  let timeouts = [];

  const getPlayerSpawn = map =>
    map.reduce((a, c, y) => {
      const n = c.indexOf(PLAYER);
      if (n !== -1) {
        a.x = n + 0.5; // 0.5 = spawn in the middle of the block
        a.y = y + 0.5;
      }
      return a;
    }, { x: 0, y: 0 });

  const addPlayer = (input, assets, spawn) => {
    const player = createPlayer(color, scene, assets);
    player.setInput(input);
    player.setSpawn(spawn);
    player.revive();
    players.push(player);
  };

  const addTargets = () => {
    targets.forEach(({ x, y }) => {
      map.setBlock(x, y, TARGET);
    });
  };

  const addSwitches = () => {
    switches.forEach(({ x, y }) => {
      map.setBlock(x, y, SWITCH);
    });
  };

  const removeSwitch = collision => {
    const { x, y } = collision;
    map.removeBlock(collision);
    switches.forEach((s, i, a) => {
      if (x === s.x && y === s.y) {
        a.splice(i, 1);
      }
    });
    if (switches.length === 0) {
      sound.unlock();
      addTargets();
    }
  };

  const removeTarget = collision => {
    const { x, y } = collision;
    map.removeBlock(collision);
    targets.forEach((t, i, a) => {
      if (x === t.x && y === t.y) {
        a.splice(i, 1);
      }
    });
  };

  api.update = (ticks, step) => {
    players.forEach((player, i) => {
      player.update(ticks, step);
      // TODO: Reafctor collisions!
      if (!player.isDead()) {
        if (player.isMan()) {
          map.handleCollides(player, WALL);
          // check missile only
          map.checkCollides(player, MISSILE, (player, collision, type, x, y) => {
            if (!player.isDead()) {
              player.kill();
              if (i === 0) {
                timeouts.push(setTimeout(() =>
                  api.emit('player.lose', player.getSerializedInput())
                , 1000));
              }
            }
          });

          // check switches
          map.checkCollides(player, SWITCH, (player, collision, type, x, y) => {
            // TODO: do we need to check if not a replay?
            removeSwitch(collision);
          });

        } else {
          // check walls
          map.checkCollides(player, WALL, (player, collision, type) => {
            if (!player.isDead()) {
              player.kill();
              if (i === 0) {
                timeouts.push(setTimeout(() =>
                  api.emit('player.lose', player.getSerializedInput())
                , 1000));
              }
            }
          });

          //check target
          map.checkCollides(player, TARGET, (player, collision, type, x, y) => {
            // TODO: need to check if this is the player or a replay
            if (!player.isDead()) {
              removeTarget(collision);
              player.kill();
              // TODO: check if all targets are removed first!
              if (i === 0) {
                timeouts.push(setTimeout(() =>
                  api.emit('player.win', player.getSerializedInput())
                , 1000));
              }
            }
          });
        }
      }
    });
  };

  const createSwitches = blocks => {
    switches = [];
    blocks.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell === SWITCH) {
          switches.push({ x, y });
        }
      });
    });
  };

  const createTargets = blocks => {
    blocks.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell === TARGET) {
          targets.push({ x, y });
        }
      });
    });
  };

  api.render = dt => {
    // TODO: declare this function elsewhere
    players.forEach(player => {
      player.render(dt);
    });

    scene.follow(players[0].position());
    // scene.follow({ x: 15, y: 15 });
    scene.render();
  };

  api.load = (level, assets, inputs) => {
    const { blocks } = level;
    const playerSpawn = getPlayerSpawn(blocks);

    timeouts.forEach(clearTimeout);
    timeouts = [];
    targets = [];
    switches = [];
    players.forEach(p => p.stop());
    players = [];

    inputs.forEach(input => {
      addPlayer(input, assets, playerSpawn);
    });

    map = createMap(scene, assets, blocks[0].length, blocks.length);

    blocks.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell === WALL || cell === MISSILE) {
          map.setBlock(x, y, cell);
        };
      });
    });

    createSwitches(blocks);
    createTargets(blocks);
    if (switches.length > 0) {
      addSwitches();
    } else {
      addTargets();
    }
  };

  events(api);
  return api;
};
