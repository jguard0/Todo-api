var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');


var app = express();
var PORT = process.env.PORT || 3000;
var todoNextId = 1;
var todos = [];

// var todos = [{
// 	id: 1,
// 	description: 'meet my cousin for lunch',
// 	completed: false,
// }, {
// 	id: 2,
// 	description: 'buy some food',
// 	completed: false,
// }, {
// 	id: 3,
// 	description: 'spend time with my son',
// 	completed: true,
// }];

app.use(bodyParser.json());

app.get('/', function(request, request) {
	request.send('Todo API Root!');
});

// GET /todos
app.get('/todos', function(request, response) {
	var queryParams = request.query;
	var filterTodos = todos;
	var bool;

	console.log(queryParams);

	if (queryParams.hasOwnProperty('completed')) {

		if (queryParams.completed == 'true')
			bool = true;
		else bool = false;

		filterTodos = _.where(filterTodos, {
			'completed': bool
		});
	}

	if (queryParams.hasOwnProperty('desc') && queryParams.desc.length > 0) {
		filterTodos = _.filter(filterTodos, function(items) {
			return items.description.toLowerCase().
			indexOf(queryParams.desc.toLowerCase()) > 0;
		});
	}

	response.json(filterTodos);
});

// GET /todos/:id
app.get('/todos/:id', function(request, response) {
	var todoId = parseInt(request.params.id, 10);
	
	console.log('todoId: ' + todoId);

	db.todo.findById(todoId).then(function (todo) {
		if(todo) {
			return response.status(200).json(todo);
			console.log(todo.toJSON());
		} else {
			return response.status(400).json('item not found');
			console.log('item not found');
		}
	}).catch(function (e) {
		return response.status(500);
		console.log(e);
	});

	// var matchItems = _.findWhere(todos, {
	// 	id: todoId
	// });

	// // var matchItems;
	// // // find the match
	// // todos.forEach(function (items) {
	// // 	if(todoId == items.id) {
	// // 		matchItems = items;
	// // 		return;
	// // 	}
	// // });

	// if (matchItems)
	// 	response.json(matchItems);
	// else response.status(404).send();
});

// PUT /todos/:id
app.put('/todos/:id', function(request, response) {
	var body = _.pick(request.body, 'description', 'completed');
	var todoId = parseInt(request.params.id, 10);
	var matchedItem = _.findWhere(todos, {
		id: todoId
	});

	if (!matchedItem) {
		return response.status(404).json({
			'Error': 'Item not found'
		});
	}

	var validAttributes = {};

	if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
		validAttributes.completed = body.completed;
	} else if (body.hasOwnProperty('completed')) {
		return response.status(400).json({
			'Error': 'Completed attributed is not in the correct format'
		});
	}

	if (body.hasOwnProperty('description') &&
		_.isString(body.description) && body.description.trim().length > 0) {
		validAttributes.description = body.description;
	} else if (body.hasOwnProperty('description')) {
		return response.status(400).json({
			'Error': 'Description attributed is not in the correct format'
		});
	}

	_.extend(matchedItem, validAttributes);
	response.json(matchedItem);
});

app.delete('/todos/:id', function(request, response) {
	var todoId = parseInt(request.params.id, 10);
	
	var array = _.without(todos, _.findWhere(todos, {'id': todoId}));
	var matchedItem = _.findWhere(todos, {
		id: todoId
	});

	if (!matchedItem)
		response.status(404).json({
			'Error': 'No item found with that id'
		});
	else
		todos = _.without(todos, matchedItem);
	response.json(matchedItem);
	return;
});

// POST /todos
app.post('/todos', function(request, response) {
	var body = _.pick(request.body, 'description', 'completed');

	db.todo.create(body).then(function(todo) {
		response.json(todo.toJSON());
	}, function(e) {
		response.status(400).json(e);
	});

	// if (!_.isBoolean(body.completed) ||
	// 	!_.isString(body.description) ||
	// 	body.description.trim().length == 0) {

	// 	return response.status(400).send();
	// }

	// // incerment the id number
	// body.id = todoNextId++;
	// body.description = body.description.trim();

	// // push the body into the array
	// todos.push(body);
	// // push the response object to output strem
	// response.json(body);
});

db.sequelize.sync().then(function() {
	app.listen(PORT, function() {
		console.log('Express listening on port ' + PORT + '!');
	});
});