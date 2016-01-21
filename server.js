var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var bodyParser = require('body-parser');
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
	var todoId = request.params.id;
	var matchItems;

	// find the match
	todos.forEach(function (items) {
		if(todoId == items.id) {
			matchItems = items;
			return;
		}
	});

	if(matchItems)
		response.json(matchItems);
	else response.status(404).send();
});

// POST /todos
app.post('/todos', function (request, response) {
	var body = request.body;

	body.id = todoNextId++;

	todos.push(body);

	response.json(body);
});

app.listen(PORT, function (){
	console.log('Express listening on port '  + PORT + '!');
});