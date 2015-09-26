var zoom = 20;

module.exports = function (canvas) {
  'use strict';

  var ret,
    scene = new THREE.Scene(),
    cam = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.2, zoom),
    dlight = new THREE.DirectionalLight(0xffffff, 1),
    alight = new THREE.AmbientLight(0xffffff),
    renderer = new THREE.WebGLRenderer();

  cam.position.set(0, 0, zoom);
  cam.updateProjectionMatrix();

  scene.add(cam);
  scene.add(dlight);
  scene.add(alight);

  renderer.setSize(window.innerWidth, window.innerHeight);
  $('body').append(renderer.domElement);

  +function render () {
    requestAnimationFrame(render);
    $(ret).trigger('scene.render');
    renderer.render(scene, cam);
  }();

  ret = {
    add: function (m) {
      scene.add(m);
    },
    follow: function (p) {
      cam.position.set(p.x, p.y, zoom);
    },
    remove: function (m) {
      scene.remove(m);
    }
  };
  return ret;
};
