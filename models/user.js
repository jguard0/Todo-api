module.exports = function(sequelize, DataTipes) {
	return sequelize.define('user', {
		email: {
			type: DataTipes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true
			}
		},
		password: {
			type: DataTipes.STRING,
			allowNull: false,
			validate: {
				len: [7, 100]
			}
		}
	}, {
		hooks: {
			beforeValidate: function (user, options) {
				if (typeof user.email == 'string') {
					user.email = user.email.toLowerCase();
				}
			}
		}
	});
}