var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect': 'sqlite',
	'storage': __dirname + '/sqlite_db.sqlite'
});

var Todo = sequelize.define('todo', {
	description: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			len: [1, 250]
		}
	},
	completed: {
		type: Sequelize.BOOLEAN,
//		allowNull: false,
		defaultValue: true
	}
});

sequelize.sync({
//	force: true
}).then(function() {
	console.log('everything is synced');

	Todo.findOne({
		where: {
			id: 2
		}
	}).then(function (todos) {
		if(todos) {
			console.log(todos.toJSON());
		} else {
			console.log('item not found');
		}
	}).catch(function (e) {
		console.log(e);
	});

// 	Todo.create({
// 		description: 'eat some lunch',
// 		completed: false
// 	}).then(function (todo) {
// 		return Todo.create ({
// 			description: 'clean office',
// 			completed: false
// 		});
// 	}).then (function () {
// //		return Todo.findById(1);
// 		return Todo.findAll({
// //		where: {
// //			completed: false
// //		}
// 			where: {
// 				completed: {
// 					$like: '%dog%'
// 				}
// 			}
// 		});
// 	}).then (function (todos) {
// 		if(todos) {
// 			todos.forEach(function (todo){
// 				console.log(todo.toJSON());
// 			});
// 		} else {
// 			console.log('no todos found');
// 		}
// 	}).catch(function(e) {
// 		console.log(e);
// 	});
});