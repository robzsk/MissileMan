const replay = require('./replay');
const user = require('./user');

module.exports = config => {
	config = config || {};
	return config.replay ?
		replay(config.replay) :
    user(config);
};
