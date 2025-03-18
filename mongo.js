const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('give correct credentials as arguments');
  process.exit(1);
}

const serverId = process.argv[2];
const password = process.argv[3];
const name = process.argv[4];
const number = process.argv[5];

const database = 'phonebook';

const url = `mongodb+srv://${serverId}:${password}@cluster0.lhb1h.mongodb.net/${database}?retryWrites=true&w=majority&appName=Cluster0`;

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

person.save().then(result => {
  console.log('Contact saved!');
});

Person
  .find({}).then(persons=> {
    persons.forEach(person => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
