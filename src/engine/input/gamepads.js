let gamepads;

module.exports = {
	update: () => {
		gamepads = navigator.getGamepads();
	},
	get: index => gamepads[index],
};
