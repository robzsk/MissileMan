const THREE = require('three');
const events = require('minivents');
const createRenderer = require('./renderer');

const color = new THREE.Color('rgb(55, 116, 196)');
const createPlayer = require('./player');
const map = require('./map')();

const MASK = {
  wall: 1,
  target: 2,
};

module.exports = scene => {
  // let player;
  let players = [];
  let target;
  const api = {};
  let renderer;
  let timeoutWin;

  const addTarget = (position, assets) => {
    const avatar = assets.model.cubeTarget(color);
    avatar.position.set(position.x, position.y, 0);
    scene.add(avatar);
    map.setBlock(position.x, position.y, MASK.target);
    target = {
      avatar,
      position,
    };
  };

  const removeTarget = position => {
    if (target) {
      scene.remove(target.avatar);
      map.removeBlock(position.x, position.y);
      target = null;
    }
  };

  const addPlayer = (input, assets) => {
    const player = createPlayer(color, scene, assets);
    player.setInput(input);
    player.setSpawn({ x: 1.5, y: 18.5 });
    player.revive();
    players.push(player);
  }

  api.update = (ticks, step) => {
    players.forEach((player, i) => {
      player.update(ticks, step);
      if (!player.isDead()) {
        if (player.isMan()) {
          map.handleCollides(player, MASK.wall);
        } else {

          // check walls
          map.checkCollides(player, MASK.wall, (player, collision, type) => {
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
          map.checkCollides(player, MASK.target, (player, collision, type, x, y) => {
            // TODO: need to check if this is the player or a replay
            if (!player.isDead()) {
              removeTarget(collision);
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
    scene.render();
  };

  api.load = (level, assets, inputs) => {
    clearTimeout(timeoutWin);
    renderer = createRenderer(scene, assets);
    map.addBlocks(level.walls);
    target = null;
    players = [];
    addTarget(level.target, assets);
    inputs.forEach(input => {
      addPlayer(input, assets);
    });
    renderer.addWalls(level.walls);
  };

  events(api);
  return api;
};
