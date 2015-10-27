var zoom = 26;

module.exports = function () {
  'use strict';

  var ret,
    scene = new THREE.Scene(),
    cam = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, zoom - 9, zoom),
    // dlight = new THREE.DirectionalLight(0xffffff, 1),
    alight = new THREE.AmbientLight(0xffffff),
    renderer = new THREE.WebGLRenderer();

  cam.position.set(0, 0, zoom);
  cam.updateProjectionMatrix();

  scene.add(cam);
  // scene.add(dlight);
  scene.add(alight);

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x3e3e3e, 1);
  document.body.appendChild(renderer.domElement);

  ret = {
    render: function () {
      renderer.render(scene, cam);
    },

    add: function (m) {
      scene.add(m);
    },

    follow: function (p) {
      cam.position.set(p.x, p.y, zoom);
    },

    remove: function (m) {
      scene.remove(m);
    },

    clear: function () {
      var children = _.clone(scene.children);
      _.each(children, function (child) {
        scene.remove(child);
      });
    }

  };
  return ret;
};
