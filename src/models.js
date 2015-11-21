module.exports = {
	missile: {
		'vertices': [-0.25, 0.5, -0, 0.25, 0.5, -0, -0.25, -0.5, 0, 0.25, -0.5, -0, -0.25, -0.1, -0, 0.25, -0.1, -0],
		'faces': [3, 4, 2, 3, 5, 1, 3, 0, 4, 5, 1, 0],
		'name': 'CubeGeometry.5',
		'metadata': {
			'version': 3,
			'vertices': 6,
			'type': 'Geometry',
			'faces': 2,
			'materials': 2,
			'generator': 'io_three'
		},
		'materials': [{
			'shading': 'lambert',
			'depthTest': true,
			'opacity': 1,
			'wireframe': false,
			'transparent': false,
			'colorDiffuse': [1, 1, 1],
			'DbgName': 'Body',
			'depthWrite': true,
			'blending': 'NormalBlending',
			'DbgIndex': 0,
			'colorEmissive': [1, 1, 1],
			'visible': true
		}, {
			'shading': 'lambert',
			'depthTest': true,
			'opacity': 1,
			'wireframe': false,
			'transparent': false,
			'colorDiffuse': [0.015066, 0.023716, 1],
			'DbgName': 'Head',
			'depthWrite': true,
			'blending': 'NormalBlending',
			'DbgIndex': 1,
			'colorEmissive': [0.015066, 0.023716, 1],
			'visible': true
		}]
	},
	man: {
		'vertices': [0.25, -0.5, -0, -0.25, -0.5, -0, 0.25, 0.5, 0, -0.25, 0.5, -0, 0.25, 0.1, -0, -0.25, 0.1, -0],
		'faces': [3, 4, 2, 3, 5, 1, 3, 0, 4, 5, 1, 0],
		'name': 'CubeGeometry.4',
		'metadata': {
			'version': 3,
			'vertices': 6,
			'type': 'Geometry',
			'faces': 2,
			'materials': 2,
			'generator': 'io_three'
		},
		'materials': [{
			'shading': 'lambert',
			'depthTest': true,
			'opacity': 1,
			'wireframe': false,
			'transparent': false,
			'colorDiffuse': [1, 1, 1],
			'DbgName': 'Body',
			'depthWrite': true,
			'blending': 'NormalBlending',
			'DbgIndex': 0,
			'colorEmissive': [1, 1, 1],
			'visible': true
		}, {
			'shading': 'lambert',
			'depthTest': true,
			'opacity': 1,
			'wireframe': false,
			'transparent': false,
			'colorDiffuse': [0.015066, 0.023716, 1],
			'DbgName': 'Head',
			'depthWrite': true,
			'blending': 'NormalBlending',
			'DbgIndex': 1,
			'colorEmissive': [0.015066, 0.023716, 1],
			'visible': true
		}]
	},
	empty: {
		'metadata': {
			'version': 3,
			'generator': 'io_three',
			'vertices': 4,
			'uvs': 0,
			'faces': 1,
			'type': 'Geometry',
			'normals': 2
		},
		'vertices': [1, 0, 0, 0, 0, -0, 1, 1, 0, 0, 1, -0],
		'uvs': [],
		'name': 'CubeGeometry.4',
		'faces': [33, 1, 0, 2, 3, 0, 1, 1, 1],
		'normals': [0, 0, 0.999969, 0, 0, 1]
	},
	solid: {
		'metadata': {
			'version': 3,
			'generator': 'io_three',
			'vertices': 8,
			'uvs': 0,
			'faces': 6,
			'type': 'Geometry',
			'normals': 8
		},
		'vertices': [1, 0, 0, 1, 0, 1, -0, 0, 1, 0, 0, -0, 1, 1, 0, 1, 1, 1, -0, 1, 1, 0, 1, -0],
		'uvs': [],
		'name': 'CubeGeometry.2',
		'faces': [33, 0, 1, 2, 3, 0, 1, 2, 3, 33, 4, 7, 6, 5, 4, 5, 6, 7, 33, 0, 4, 5, 1, 0, 4, 7, 1, 33, 1, 5, 6, 2, 1, 7, 6, 2, 33, 2, 6, 7, 3, 2, 6, 5, 3, 33, 4, 0, 3, 7, 4, 0, 3, 5],
		'normals': [0.577349, -0.577349, -0.577349, 0.577349, -0.577349, 0.577349, -0.577349, -0.577349, 0.577349, -0.577349, -0.577349, -0.577349, 0.577349, 0.577349, -0.577349, -0.577349, 0.577349, -0.577349, -0.577349, 0.577349, 0.577349, 0.577349, 0.577349, 0.577349]
	}
};
