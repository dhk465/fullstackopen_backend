require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const app = express();
const Person = require("./models/person");

// Middleware
app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

morgan.token("body", function (request, response) {
  if (request.method === "POST") {
    return JSON.stringify(request.body);
  }
});

// using dist for frontend build
app.use(express.static("dist"));

// Error handling middleware definition
const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  }

  next(error);
};

// let persons = [
//   {
//     "id": "1",
//     "name": "Arto Hellas",
//     "number": "040-123456"
//   },
//   {
//     "id": "2",
//     "name": "Ada Lovelace",
//     "number": "39-44-5323523"
//   },
//   {
//     "id": "3",
//     "name": "Dan Abramov",
//     "number": "12-43-234345"
//   },
//   {
//     "id": "4",
//     "name": "Mary Poppendieck",
//     "number": "39-23-6423122"
//   }
// ];

// Function to generate a random unique id
// function getRandomId(max) {
//   return Math.floor(Math.random() * max);
// }

// function generateId() {
//   let maxId = 2147483647;
//   let id = getRandomId(maxId);
//   while (persons.find(person => person.id === id)) {
//     id = getRandomId(maxId);
//   }
//   return id.toString();
// }

// Routes

// Get the root (frontend page)
app.get("/", (request, response) => {
  response.end("Hello World");
});

// Get all persons
app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

// Get a single person by id
app.get("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  Person.findById(id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).send({ error: "Person not found" });
      }
    })
    .catch((error) => next(error));
});

// Delete a person
app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  Person.findByIdAndDelete(id)
    .then(result => {
      response.status(204).end();
    })
    .catch(error => next(error));
});

// Add a new person
app.post("/api/persons", (request, response) => {
  const body = request.body;
  console.log(body);

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name or number is missing",
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => {
    response.json(savedPerson);
  });
});

// Update a person's number
app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body;

  Person.findById(request.params.id)
    .then(person => {
      if (!person) {
        return response.status(404).send({ error: "Person not found" });
      }

      person.name = name;
      person.number = number;

      return person.save().then((updatedPerson) => {
        response.json(updatedPerson);
      });
    })
    .catch(error => next(error));
});

app.get("/info", (request, response) => {
  response.setHeader("Content-Type", "text/plain; charset=utf-8"); // Sets the encoding to utf-8 in case of non-ascii characters
  const date = new Date();
  response.end(`Phonebook has info for ${Person.length + 1} people \r\n${date}`);
});

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
