const { TARGET, WALL, MISSILE, SWITCH } = require('./../mask');

module.exports = (scene, assets) => {
  const dictionary = {};

  const blockIndex = (x, y) => `${x}.${y}`;

  const addBlock = (scene, assets, x, y, mask) => {
    let cube;
    switch (mask) {
      case TARGET:
        cube = assets.model.target();
        cube.position.set(x, y, 0);
        break;
      case WALL:
        cube = assets.model.wall();
        cube.position.set(x, y, 0);
        break;
      case MISSILE:
        cube = assets.model.missileOnly();
        cube.position.set(x, y, -1);
        break;
      case SWITCH:
        cube = assets.model.switchMan();
        cube.position.set(x, y, -1);
        break;
    }
    if (cube) {
      const i = blockIndex(x, y);
      // TODO: Remove existing and re-add?
      if (!dictionary[i]) {
        dictionary[i] = cube;
        scene.add(cube);
      }
    }
  };

  const removeBlock = (scene, position) => {
    const { x, y } = position;
    const i = blockIndex(x, y);
    if (dictionary[i]) {
      scene.remove(dictionary[i]);
      dictionary[i] = undefined;
    }
  };

  return {
    addBlocks: blocks => addBlocks(scene, assets, blocks),
    removeBlock: position => removeBlock(scene, position),
    addBlock: (x, y, mask) => addBlock(scene, assets, x, y, mask),
  };
};
