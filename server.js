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

app.use('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'views' , 'html', 'register.html'));
});

app.use('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views' , 'html', 'login.html'));
});

const port = 3000;
app.listen(port, () => console.log(`Server started on port ${port}`));