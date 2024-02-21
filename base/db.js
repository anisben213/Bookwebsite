// here we gonna connect our database to node js (server.js) using mongoose and export the module to the file server.js

const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://anisbenamara213:Algermahrez26@cluster0.lymmfi4.mongodb.net/Code213');



const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error MongoDB:'));
db.once('open', function() {
  console.log('connected to database');
});

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  price: String,
});

const Book = mongoose.model('Book', bookSchema, 'Books');


module.exports = { Book };
