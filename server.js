// importing modules
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const {Book} = require('./base/db')
const mongoose = require('mongoose') // i prefer using mongoose after making some researches


app.set('view engine', 'ejs');
app.set('views',path.join(__dirname, 'views'));
// middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

//routing and rendering on login page as first access to the localhost:5000/
app.get('/',(req,res)=>{
  res.render('login')
});
// route for register page with post request
app.post('/register', (req, res) => {
  const { username, email, password } = req.body;
  const filepath = path.join(__dirname, 'data', 'users.json');
      //reading json file
  fs.readFile(filepath, 'utf-8', (err, data) => {
    let users = []; // Changed from const to let
    if (!err && data) {
      try {
        users = JSON.parse(data);
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        return res.status(500).send('An error occurred on the server.');
      }
    }
    users.push({ username, email, password }); 
        //update json file after register
    fs.writeFile(filepath, JSON.stringify(users, null, 3), err => {
      if (err) {
        console.error(err);
        return res.status(500).send('An error occurred while registering.');
      }
      console.log('Register done successfully.');
      res.redirect('/login');// redirection to login page after sing-up done
    });
  });
});
  // route to login page
app.get('/login',(req,res)=>{
  res.render('login');
});
  // set-up the login logic with post request
app.post('/login',(req,res)=>{
  const { email , password} = req.body;
  const pathfile = path.join(__dirname,'data','users.json');
  fs.readFile(pathfile,(err,data)=>{
    if(err) {
      console.error(err);
      return res.status(404).send('error file not found');
    }
    const users = JSON.parse(data);
    const user = users.find(user => user.email.toLowerCase()=== email.toLowerCase()) ;// here , user is an object element from users array , we use users.find() with a callback function to identify user from it's email
    if(user) {
      if(user.password === password) {
        console.log('connexion reussie');
        res.redirect('/home');
      } else {
        console.log('password wrong');
        res.status(401).redirect('/login')
      }

    } else {
      res.status(401).send('user not found');
    }
  });
});

// set-up route for home page
app.get('/book', async (req,res)=>{
  const books = await Book.find({}) // find books from database

  res.render('book',{books});
});
// route for add-book page with post request
app.post('/add-book', async (req, res) => {
  try {
    const { title, author, price } = req.body;
    const newBook = new Book({ title, author, price });
    await newBook.save();// adding document to database
    res.redirect('/home');
  } catch (error) {   //handling error
    console.error(error);
    res.status(500).send('error , book not added');
  }
});
// route for a get request to add-book page
app.get('/add-book',(req,res)=>{
  res.render('add-book')
})

// route for a get request to home page
app.get('/home', async (req,res)=>{
  try {
    const books = await Book.find({})
      res.render('home', {booklist:books});

  }catch (err){
    console.error(err);
    res.status(500).send('error charging database')

  }
});

//route for a get request to register page
app.get('/register',(req,res)=>{
  res.render('register');
});

/* listening to the server */
const port = 5000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
