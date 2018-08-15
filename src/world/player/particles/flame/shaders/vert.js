module.exports = `
float quarticOut(float t) {
  return pow(t - 1.0, 3.0) * (1.0 - t) + 1.0;
}
float exponentialOut(float t) {
  return t == 1.0 ? t : 1.0 - pow(2.0, -10.0 * t);
}

attribute vec2 velocity;
attribute float time;
varying float vTime;
void main() {
	vTime = time;
	vec3 pos = vec3(position);
	pos.x = position.x + (exponentialOut(time) * velocity.x);
	pos.y = position.y + (exponentialOut(time) * velocity.y);
	vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
	gl_PointSize = 9.0;
	gl_Position = projectionMatrix * mvPosition;
}`;
