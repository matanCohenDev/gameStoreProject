//dont forget npm i
//if you want to run the tests, do:
//open two terminals - one cd gameStoreProject , and one cd tests
//in the gameStoreProject terminal - nodemon server.js - the server must be running for the tests
//in the tests terminal - dotnet build - download packages like npm i, dotnet test - to run the tests
// if you want to see how it the test works, add System.Threading.Thread.Sleep(2000); before : .SendKey("something") or .click() 
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');

const app = express();

// Bodyparser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// DB Config
mongoose.connect('mongodb+srv://gameStore:gameStore123456@gamestore.tshx1.mongodb.net/', {
})
.then(() => {
    console.log('connected to db');
})
.catch((err) => {
    console.log('error', err);
});

app.use(express.static(path.join(__dirname, 'public')));

// Express Session
app.use(session({
    secret : 'secret',
    resave : false,
    saveUninitialized : true,
    cookie : { secure : false }
}));

// Routes
app.use('/api/users', require('./routes/users-routes'));
app.use('/api/products', require('./routes/products-routes'));
app.use('/api/orders', require('./routes/orders-routes'));

app.use('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'views' , 'html', 'admin.html'));
});

//מניעת משתמש רגיל להיכנס לדף האדמין
//צריך להוסיף עוד עו תנאי על מנת שמשתמש לא יוכל לחזור חזרה לדף הלוגין אם מחובר
app.use('/', (req, res) => {
    if(req.session.user && req.session.user.username === 'admin'){
        res.sendFile(path.join(__dirname, 'views' , 'html', 'admin.html'));
    }
    else {
    res.sendFile(path.join(__dirname, 'views' , 'html', 'login.html'));
    }
});

const port = 3000;
app.listen(port, () => console.log(`Server started on port ${port}`));
