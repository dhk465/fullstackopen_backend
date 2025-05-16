require('dotenv').config();
const mongoose = require('mongoose');

// if (process.argv.length < 3) {
//   console.log('give correct credentials as arguments');
//   process.exit(1);
// }

// const serverId = process.env.DB_LOGIN;
// const password = process.env.DB_PASSWORD;
const name = process.argv[2];
const number = process.argv[3];

// const database = process.env.DB_NAME;

// const url = `mongodb+srv://${serverId}:${password}@cluster0.48ct0y3.mongodb.net/${database}?retryWrites=true&w=majority&appName=Cluster0`;

const url = process.env.DB_URL;

mongoose.set('strictQuery',false);

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Contact', personSchema);

const person = new Person({
  name: name,
  number: number,
});

person.save().then(() => {
  console.log('Contact saved!');
});

Person
  .find({}).then(persons => {
    persons.forEach(person => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
