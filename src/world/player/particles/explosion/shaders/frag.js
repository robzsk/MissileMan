module.exports = (r, g, b) => `
float cubicOut(float t) {
  float f = t - 1.0;
  return f * f * f + 1.0;
}
varying float vTime;
void main() {
	gl_FragColor = vec4(${r},${g},${b},cubicOut(1.0-vTime));
}`;
