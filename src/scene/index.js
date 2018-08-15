const THREE = require('three');
const shake = require('./shake');
const edge = require('./edge');

// TODO: need to configure these better
edge.set(64, 53);
const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const zoom = 1;
const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;

module.exports = domElement => {
	const scene = new THREE.Scene();
	// cam = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 26 - 9, 26),
	const cam = new THREE.OrthographicCamera(windowWidth * zoom / -2, windowWidth * zoom / 2, windowHeight * zoom / 2, windowHeight * zoom / -2, 0, 1);

	// cam = new THREE.PerspectiveCamera(40, WIDTH / HEIGHT, 1, 10000);

	const ambientLight = new THREE.AmbientLight(0xffffff);
	const renderer = new THREE.WebGLRenderer({ antialias: true });

	cam.position.set(0, 0, 10);
	cam.zoom = 28;
	// cam.position.z = 300;
	cam.updateProjectionMatrix();

	scene.add(cam);
	scene.add(ambientLight);

	renderer.setSize(window.innerWidth, window.innerHeight);
	domElement.appendChild(renderer.domElement);

  const getCameraPosition = () => cam.position; // TODO: return a copy instead

  const render = () => {
    shake.update();
    renderer.render(scene, cam);
  };

  const add = mesh => {
    scene.add(mesh);
  };

  const follow = player => {
    // const e = shake.get(edge.get(player));
    const e = shake.get(player);
    cam.position.set(e.x, e.y, zoom);
  };

  const boom = () => {
    shake.start();
  };

  const remove = mesh => {
    scene.remove(mesh);
  };

  const clear = () => {
		// scene.children.forEach(child => {
		// 	if (child !== ambientLight) {
		// 		scene.remove(child);
		// 	}
		// })
		while (scene.children.length > 0) {
			scene.remove(scene.children[0]);
		}
		scene.add(ambientLight);
		shake.stop();
  };

	return {
		getCameraPosition,
    render,
    add,
    follow,
    boom,
    remove,
    clear,
	};
};
