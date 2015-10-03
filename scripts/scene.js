var zoom = 26;

module.exports = function (canvas) {
  'use strict';

  var stats = function () {
    var s = {begin: function () {},end: function () {}};

    if (typeof Stats !== 'undefined') {
      s = new Stats();
      s.setMode(0);
      s.domElement.style.position = 'absolute';
      s.domElement.style.left = '0px';
      s.domElement.style.top = '0px';
      $('body').append(s.domElement);
    }
    return s;
  }();

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
  $('body').append(renderer.domElement);

  +function render () {
    stats.begin();
    requestAnimationFrame(render);
    $(ret).trigger('scene.render');
    renderer.render(scene, cam);
    stats.end();
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
