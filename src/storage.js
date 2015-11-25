'use strict';

var replay_default = [{'spawn': {'x': 1.5,'y': 21},'input': '{"36":{"left":false,"right":false,"jump":false,"morph":true},"43":{"left":false,"right":false,"jump":false,"morph":false},"44":{"left":false,"right":true,"jump":false,"morph":false},"73":{"left":false,"right":false,"jump":false,"morph":false},"113":{"left":true,"right":false,"jump":false,"morph":false},"173":{"left":false,"right":false,"jump":false,"morph":false},"181":{"left":false,"right":true,"jump":false,"morph":false}}'}, {'spawn': {'x': 2.5,'y': 21},'input': '{"39":{"left":false,"right":false,"jump":false,"morph":true},"48":{"left":false,"right":false,"jump":false,"morph":false},"59":{"left":false,"right":true,"jump":false,"morph":false}}'}, {'spawn': {'x': 3.5,'y': 21},'input': '{"1":{"left":false,"right":false,"jump":false,"morph":false},"39":{"left":false,"right":false,"jump":false,"morph":true},"46":{"left":false,"right":false,"jump":false,"morph":false},"49":{"left":false,"right":true,"jump":false,"morph":false},"67":{"left":false,"right":false,"jump":false,"morph":false}}'}];

var _ = require('underscore'),
	Input = require('./engine/input');

module.exports = function () {
	'use strict';
	var s = function (k, v) {
		if (k && v) {
			localStorage.setItem(k, JSON.stringify(v));
		} else if (k && !v) {
			return JSON.parse(localStorage.getItem(k));
		} else {
			console.error('Key was undefined while using local storage.');
		}
	};
	return {
		replays: function (v) {
			var reps, replays;
			if (v) {
				reps = [];
				_.each(v, function (r) {
					reps.push({
						spawn: r.spawn,
						input: r.input.serialize()
					});
				});

				return s('replays', reps);
			} else {
				reps = s('replays', reps);
				if (!reps) {
					reps = replay_default;
					console.log('default replays loaded');
				}
				replays = [];
				_.each(reps, function (r) {
					replays.push({
						spawn: r.spawn,
						input: new Input({replay: r.input})
					});
				});
				return replays;
			}
		},

		test: function (v) {
			return s('test', v);
		},

		error: function () {
			return s();
		}

	};
}();
