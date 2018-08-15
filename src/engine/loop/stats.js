let Stats;
try { Stats = require('stats.js'); } catch(e) {}

const stats = () => {
  if (typeof Stats !== 'undefined') {
    const s = new Stats();
    s.setMode(0);
    s.domElement.style.position = 'absolute';
    s.domElement.style.left = '0px';
    s.domElement.style.top = '0px';
    document.body.appendChild(s.domElement);
    return s;
  }
  return null;
};

module.exports = stats();
