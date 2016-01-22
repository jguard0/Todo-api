var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

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

app.get('/', function (request, request){
	request.send('Todo API Root!');

});

// GET /todos
app.get('/todos', function (request, response){
	response.json(todos);
});

// GET /todos/:id
app.get('/todos/:id', function (request, response){
	var todoId = parseInt(request.params.id, 10);
	var matchItems = _.findWhere(todos, {id: todoId});

	// var matchItems;
	// // find the match
	// todos.forEach(function (items) {
	// 	if(todoId == items.id) {
	// 		matchItems = items;
	// 		return;
	// 	}
	// });

	if(matchItems)
		response.json(matchItems);
	else response.status(404).send();
});

app.delete('/todos/:id', function (request, response) {
	var todoId = parseInt(request.params.id, 10);
	var array = _.without(todos, _.findWhere(todos, {'id': todoId}));

	if(!_.isEmpty(array))
		response.json(array);
	else response.status(404).json({'Error': 'No item found with that id'});

	return;

});

// POST /todos
app.post('/todos', function (request, response) {
	var body = _.pick(request.body, 'description', 'completed');

	if(!_.isBoolean(body.completed) || 
		!_.isString(body.description) || 
		body.description.trim().length == 0) {

		return response.status(400).send();
	}

	// incerment the id number
	body.id = todoNextId++;
	body.description = body.description.trim();

	// push the body into the array
	todos.push(body);
	// push the response object to output strem
	response.json(body);
});

app.listen(PORT, function (){
	console.log('Express listening on port '  + PORT + '!');
});