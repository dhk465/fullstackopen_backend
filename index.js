const express = require('express');
const morgan = require('morgan');
const app = express();

app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

morgan.token('body', function (request, response) {
  if (request.method === 'POST') {
    return JSON.stringify(request.body);
  }
});

let persons = [
  { 
    "id": "1",
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": "2",
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": "3",
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": "4",
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
];


// Function to generate a random unique id

function getRandomId(max) {
  return Math.floor(Math.random() * max);
}

function generateId() {
  let maxId = 2147483647;
  let id = getRandomId(maxId);
  while (persons.find(person => person.id === id)) {
    id = getRandomId(maxId);
  }
  return id.toString();
}

app.get('/', (request, response) => {
  response.end('Hello World');
});

app.get('/api/persons', (request, response) => {
  response.json(persons);
});

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  const person = persons.find(person => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  persons = persons.filter(person => person.id !== id);
  response.status(204).end();
});

app.post('/api/persons', (request, response) => {
  const body = request.body;
  console.log(body);

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number is missing'
    });
  }

  if (persons.find(person => person.name === body.name)) {
    return response.status(400).json({
      error: 'name must be unique'
    });
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number
  };

  persons = persons.concat(person);

  response.json(person);
});

app.get('/info', (request, response) => {
  response.setHeader('Content-Type', 'text/plain; charset=utf-8'); // Sets the encoding to utf-8 in case of non-ascii characters
  const date = new Date();
  response.end(`Phonebook has info for ${persons.length} people \r\n${date}`);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});