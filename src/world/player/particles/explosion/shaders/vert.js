module.exports = `

float exponentialOut(float t) {
  return t == 1.0 ? t : 1.0 - pow(2.0, -10.0 * t);
}

attribute vec2 velocity;
attribute float time;
varying float vTime;
void main() {
	vTime = time;
	vec3 pos = vec3(position);
	pos.x = position.x + (exponentialOut(time) * 3.0 * velocity.x);
	pos.y = position.y + (exponentialOut(time) * 3.0 * velocity.y);
	vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
	gl_PointSize = (exponentialOut(time)) * 25.0;
	gl_Position = projectionMatrix * mvPosition;
}`;
