const THREE = require('three');
const thrust = require('./thrust');
const createEntity = require('./entity');
const createMorph = require('./morph');
const createFlame = require('./particles/flame');
const createExplosion = require('./particles/explosion');

const MISSILE_MAX_SPEED = 10.0;
const MISSILE_MAX_ANGULAR_SPEED = 5.0;
const MISSILE_TORQUE = 50.0;
const MISSILE_TRUST = new THREE.Vector3(0, 50.0, 0);
const MAN_MAX_XSPEED = 10;
const MAN_MAX_YSPEED = 10;
const RUN_FORCE = 50;
const GRAVITY = 100;

const RADIUS = 0.2;
const points = [
	{ x: 0, y: 0.32, z: 0, r: RADIUS, rs: RADIUS * RADIUS },
	{ x: 0, y: -0.32, z: 0, r: RADIUS, rs: RADIUS * RADIUS }
];

module.exports = (color, scene, assets) => {
	const entity = createEntity(points);
	const avatar = {};
	let dead = false;
	let input;
	const flame = createFlame(color, scene);
	const explosion = createExplosion(color, scene);

	avatar.man = assets.model.man(color);
	avatar.missile = assets.model.missile(color);
	scene.add(avatar.man);
	scene.add(avatar.missile);
	scene.add(flame.particleSystem);
	scene.add(explosion.particleSystem);

	const keys = {
		left: false, right: false, morph: false,
		reset: function () {
			this.left = this.right = this.morph = false;
		}
	};

	const changeToMan = () => {
		entity.setRotation();
		flame.stop();
	};

	const changeToMissile = () => {
		const tolerance = 0.75;
		const v = entity.velocity();
		if (v.length() < tolerance) {
			entity.setRotation();
		} else {
			entity.setRotation(-Math.atan2(v.x, v.y));
		}
		flame.start();
	};

	const morph = createMorph(changeToMan, changeToMissile);

	const applyForce = (torque, force) => {
		if (morph.isMan()) {
			if (keys.left) {
				force.x -= RUN_FORCE;
			} else if (keys.right) {
				force.x += RUN_FORCE;
			}
			force.y -= GRAVITY;
		} else {
			if (keys.left) {
				torque.z += MISSILE_TORQUE;
			} else if (keys.right) {
				torque.z -= MISSILE_TORQUE;
			}
			thrust(force, entity.rotation(), MISSILE_TRUST);
		}
	};

	const applyDamping = (v, av) => {
		if (morph.isMan()) {
			av.z = 0;// cancel all angular velocity as man
			v.x = v.x < 0 ? Math.max(v.x, -MAN_MAX_YSPEED) : Math.min(v.x, MAN_MAX_YSPEED);
			v.y = v.y < 0 ? Math.max(v.y, -MAN_MAX_YSPEED) : Math.min(v.y, MAN_MAX_YSPEED);
			if (!keys.left && !keys.right) {
				v.x *= 0.8;
			} else if ((keys.left && v.x > 0) || (keys.right && v.x < 0)) {
				v.x *= 0.75;
			}
		} else {
			av.z = av.z < 0 ? Math.max(av.z, -MISSILE_MAX_ANGULAR_SPEED) : Math.min(av.z, MISSILE_MAX_ANGULAR_SPEED);
			if (!keys.left && !keys.right) {
				av.z *= 0.9;
			}
			if (v.length() > MISSILE_MAX_SPEED) {
				v.normalize();
				v.multiplyScalar(MISSILE_MAX_SPEED);
			}
		}
	};

	const handleInput = m => {
		keys.left = m.left;
		keys.right = m.right;
		keys.jump = m.jump;

		if (!keys.morph && m.morph) {
			morph.go();
		}
		keys.morph = m.morph;
	};

	const update = (ticks, dt) => {
		if (!dead) {
			input.update(ticks);
			morph.update();
			entity.update(dt, applyForce, applyDamping);
		}

		flame.update(entity.getPoints()[1], entity.rotation().z);
		explosion.update();
	};

	const isDead = () => dead;

	const setInput = i => {
		i.off('input.move');
		if (input) {
			input.off('input.move'); // there can be only one
		}
		input = i;
		input.reset();
		input.on('input.move', handleInput);
	};

	const setSpawn = spawn => entity.reset(spawn.x, spawn.y);

	const kill = () => {
		if (!dead) {
			dead = true;
			input.off('input.move', handleInput);
			flame.stop();
			explosion.start(entity.position());
			avatar.missile.visible = avatar.man.visible = false;
		}
	};

	const revive = () => {
		dead = false;
		keys.reset();
		morph.reset();
		flame.clear();
		explosion.clear();
		setInput(input);
	};

	const collideWithOther = other => {
		let collision = false;
		entity.getPoints().forEach(p1 => {
			other.getPoints().forEach(p2 => {
				if (Math.pow(p2.x - p1.x, 2) + Math.pow(p1.y - p2.y, 2) <= Math.pow(p1.r + p2.r, 2)) {
					collision = true;
				}
			});
		});
		return collision;
	};

	const render = dt => {
		if (!dead) {
			avatar.missile.visible = avatar.man.visible = false;
			if (morph.isMan()) {
				avatar.man.visible = true;
				avatar.man.position.set(entity.position().x, entity.position().y, 0.5);// TODO: set the z position elsewhere
				avatar.man.scale.set(morph.getScale(), morph.getScale(), morph.getScale());
			} else {
				avatar.missile.visible = true;
				avatar.missile.rotation.set(0, 0, entity.rotation().z, 'ZYX');
				avatar.missile.position.set(entity.position().x, entity.position().y, 0.5);// TODO: set the z position elsewhere
				avatar.missile.scale.set(morph.getScale(), morph.getScale(), morph.getScale());
	    }
		}
	};

	const getSerializedInput = () => input.serialize();

	return {
		update,
		isDead,
		setInput,
		setSpawn,
		revive,
		kill,
		collideWithOther,
		getSerializedInput,
		render,
		position: entity.position,
		getPoints: entity.getPoints,
		handleCollision: entity.handleCollision,
		isMan: morph.isMan,
	}
};
