const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = 'your-secret-key'; // Change this to a strong secret key


const jsonFilePath = path.join(__dirname, 'data', 'todo-list.json');
const usersFilePath = path.join(__dirname, 'data', 'users.json');

let todos = [];
let users = [];

async function loadTodosFromJsonFile() {
  try {
    const data = await fs.readFile(jsonFilePath, 'utf-8');
    todos = JSON.parse(data);
  } catch (error) {
    console.error('Error loading JSON file:', error.message);
  }
}

async function saveTodosToJsonFile() {
  try {
    await fs.writeFile(jsonFilePath, JSON.stringify(todos, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving JSON file:', error.message);
  }
}

async function loadUsersFromJsonFile() {
  try {
    const data = await fs.readFile(usersFilePath, 'utf-8');
    users = JSON.parse(data);
  } catch (error) {
    console.error('Error loading users file:', error.message);
  }
}

async function saveUsersToJsonFile() {
  try {
    await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving users file:', error.message);
  }
}

// Middleware for JSON parsing
app.use(express.json());

// Load initial todos and users from JSON files
loadTodosFromJsonFile();
loadUsersFromJsonFile();

// Middleware to check if a user is authenticated
function authenticateToken(req, res, next) {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }

    req.user = user;
    next();
  });
}

// Login route
app.post('/v1.0/login', async (req, res) => {
  const { email, password } = req.body;

  // Find the user with the provided email
  const user = users.find(u => u.email === email);

  if (user && await bcrypt.compare(password, user.password)) {
    // Generate a token for the user
    const token = jwt.sign({ userId: user.user_id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });

    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid email or password' });
  }
});

// Route to get todos based on user_id
app.get('/v1.0/todos/:user_id', authenticateToken, (req, res) => {
  const userId = parseInt(req.params.user_id);

  // Check if the user is requesting their own tasks
  if (userId !== req.user.userId) {
    return res.status(403).json({ error: 'Forbidden: You can only view your own tasks' });
  }

  const userTodos = todos.filter(todo => todo.user_id === userId);
  res.json(userTodos);
});

// Route to view tasks based on user_id
app.get('/v1.0/viewlist/:user_id', authenticateToken, (req, res) => {
  const userId = parseInt(req.params.user_id);

  // Check if the user is requesting their own tasks
  if (userId !== req.user.userId) {
    return res.status(403).json({ error: 'Forbidden: You can only view your own tasks' });
  }

  const userTasks = todos.filter(todo => todo.user_id === userId);
  res.json(userTasks);
});

// Route to update a todo based on task_id
app.put('/v1.0/todos/:task_id', authenticateToken, (req, res) => {
  const taskId = parseInt(req.params.task_id);
  const { title, detail, completed } = req.body;

  const index = todos.findIndex(todo => todo.task_id === taskId);

  if (index !== -1) {
    // Check if the user has the right to update the task
    if (todos[index].user_id !== req.user.userId) {
      return res.status(403).json({ error: 'Forbidden: You can only update your own tasks' });
    }

    todos[index] = { ...todos[index], title, detail, completed };
    saveTodosToJsonFile();
    res.json(todos[index]);
  } else {
    res.status(404).json({ error: 'Task not found' });
  }
});

// Route to remove a todo based on task_id
app.delete('/v1.0/todos/:task_id', authenticateToken, (req, res) => {
  const taskId = parseInt(req.params.task_id);

  const index = todos.findIndex(todo => todo.task_id === taskId);

  if (index !== -1) {
    // Check if the user is deleting their own task
    if (todos[index].user_id === req.user.userId) {
      const deletedTodo = todos.splice(index, 1)[0];
      saveTodosToJsonFile();
      res.json(deletedTodo);
    } else {
      res.status(403).json({ error: 'Forbidden: You can only delete your own tasks' });
    }
  } else {
    res.status(404).json({ error: 'Task not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


