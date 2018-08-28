const THREE = require('three');
const events = require('minivents');
const createRenderer = require('./renderer');
const mask = require('./mask');

const color = new THREE.Color('rgb(55, 116, 196)');
const createPlayer = require('./player');
const map = require('./map')();

module.exports = scene => {
  let players = [];
  let target;
  const api = {};
  let renderer;
  let timeoutWin;

  const getPlayerSpawn = map =>
    map.reduce((a, c, y) => {
      const n = c.indexOf(mask.PLAYER);
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
  }

  api.update = (ticks, step) => {
    players.forEach((player, i) => {
      player.update(ticks, step);
      // TODO: Reafctor collisions!
      if (!player.isDead()) {
        if (player.isMan()) {
          map.handleCollides(player, mask.WALL);
          // check missile only
          map.checkCollides(player, mask.MISSILE, (player, collision, type, x, y) => {
            if (!player.isDead()) {
              player.kill();
              if (i === 0) {
                timeoutWin = setTimeout(() =>
                  api.emit('player.lose', player.getSerializedInput())
                , 1000);
              }
            }
          });
        } else {
          // check walls
          map.checkCollides(player, mask.WALL, (player, collision, type) => {
            if (!player.isDead()) {
              player.kill();
              if (i === 0) {
                timeoutWin = setTimeout(() =>
                  api.emit('player.lose', player.getSerializedInput())
                , 1000);
              }
            }
          });

          //check target
          map.checkCollides(player, mask.TARGET, (player, collision, type, x, y) => {
            // TODO: need to check if this is the player or a replay
            if (!player.isDead()) {
              // removeTarget(collision);
              player.kill();
              if (i === 0) {
                timeoutWin = setTimeout(() =>
                  api.emit('player.win', player.getSerializedInput())
                , 1000);
              }
            }
          });
        }
      }
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
    clearTimeout(timeoutWin);
    const playerSpawn = getPlayerSpawn(level.walls);
    renderer = createRenderer(scene, assets);
    map.addBlocks(level.walls);
    players = [];
    inputs.forEach(input => {
      addPlayer(input, assets, playerSpawn);
    });
    renderer.addWalls(level.walls);
  };

  events(api);
  return api;
};
