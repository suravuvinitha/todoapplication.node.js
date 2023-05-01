const express = require("express");
const app = express();
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const dbPath = path.join(__dirname, "todoApplication.db");
app.use(express.json());

let db = null;

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running Successfully");
    });
  } catch (error) {
    console.log(DB Error: ${error.message});
    process.exit(1);
  }
};

initializeDbAndServer();

const hasPriorityAndStatusProperties = (requestQuery) => {
  return (
    requestQuery.priority !== undefined && requestQuery.status !== undefined
  );
};

const hasPriorityProperty = (requestQuery) => {
  return requestQuery.priority !== undefined;
};

const hasStatusProperty = (requestQuery) => {
  return requestQuery.status !== undefined;
};

//API 1

app.get("/todos/", async (request, response) => {
  let data = null;
  let getTodosQuery = "";
  const { search_q = "", priority, status } = request.query;

  switch (true) {
    case hasPriorityAndStatusProperties(request.query): //if this is true then below query is taken in the code
      getTodosQuery = 
   `SELECT
    *
   FROM
    todo 
   WHERE
    todo LIKE '%${search_q}%'
    AND status = '${status}'
    AND priority = '${priority}';;
      break;`
    case hasPriorityProperty(request.query):
      getTodosQuery = 
   `SELECT
    *
   FROM
    todo 
   WHERE
    todo LIKE '%${search_q}%'
    AND priority = '${priority}';;
      break;`
    case hasStatusProperty(request.query):
      getTodosQuery = 
   `SELECT
    *
   FROM
    todo 
   WHERE
    todo LIKE '%${search_q}%'
    AND status = '${status}';;
      break;`
    default:
      getTodosQuery = 
   `SELECT
    *
   FROM
    todo 
   WHERE
    todo LIKE '%${search_q}%';;
  }
  data = await db.all(getTodosQuery);
  response.send(data);
});`

//API 2

app.get("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const getTodoResult = 
    `SELECT * 
    FROM todo
    WHERE id = "${todoId}";;
  const result = await db.get(getTodoResult);
  response.send(result);
});`

//API 3

app.post("/todos/", async (request, response) => {
  const { id, todo, priority, status } = request.body;
  const addTodo = 
  `INSERT INTO todo
  (id,todo,priority,status)
  VALUES ("${id}",
  "${todo}",
  "${priority}",
  "${status}");;
  await db.run(addTodo);
  response.send("Todo Successfully Added");
});`

//API 4

app.put("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  let uniqueTodo = "";
  const requestBody = request.body;
  switch (true) {
    case requestBody.status !== undefined:
      uniqueTodo = "Status";
      break;
    case requestBody.priority !== undefined:
      uniqueTodo = "Priority";
      break;
    case requestBody.todo !== undefined:
      uniqueTodo = "Todo";
      break;
  }
  const previousTodoQuery = 
  `SELECT *
  FROM todo
  WHERE id = "${todoId}";`
  const previousTodo = await db.get(previousTodoQuery);
  const {
    todo = previousTodo.todo,
    status = previousTodo.status,
    priority = previousTodo.priority,
  } = request.body;
  const updateTodoQuery = `UPDATE todo
  SET todo = "${todo}",priority = "${priority}",status = "${status}";;
  const updateTodo = await db.run(updateTodoQuery);
  response.send(${uniqueTodo} Updated);
});`

//API 5

app.delete("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const getTodoResult = 
    `DELETE 
    FROM todo
    WHERE id = "${todoId}";;
  const deletedResult = await db.run(getTodoResult);
  response.send("Todo Deleted");
});`

module.exports = app;
