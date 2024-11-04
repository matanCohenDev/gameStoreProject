//dont forget npm i
//if you want to run the tests, do:
//open two terminals - one cd gameStoreProject , and one cd tests
//in the gameStoreProject terminal - nodemon server.js - the server must be running for the tests
//in the tests terminal - dotnet build - download packages like npm i, dotnet test - to run the tests
// if you want to see how the test works, add System.Threading.Thread.Sleep(2000); line before : .SendKey("something") or .click() 
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
app.use('/api/messages', require('./routes/messages-routes'));
app.use('/api/users', require('./routes/users-routes'));
app.use('/api/products', require('./routes/products-routes'));
app.use('/api/orders', require('./routes/orders-routes'));
app.use('/api/orders-stats', require('./routes/orders-stats-routes'));



app.use('/game/snake', (req, res) => {
    if(req.session.user){
        res.sendFile(path.join(__dirname, 'views', 'htmlGames', 'snake.html'));
    }
    else{
        res.sendFile(path.join(__dirname, 'views' , 'html', 'login.html'));
    }
});

app.use('/game/tic-tac-toe', (req, res) => {
    if(req.session.user){
        res.sendFile(path.join(__dirname, 'views', 'htmlGames', 'tic-tac-toe.html'));
    }
    else{
        res.sendFile(path.join(__dirname, 'views' , 'html', 'login.html'));
    }
});

app.use('/game/thief-&-cop', (req, res) => {
    if(req.session.user){
        res.sendFile(path.join(__dirname, 'views', 'htmlGames', 'thief&cop.html'));
    }
    else{
        res.sendFile(path.join(__dirname, 'views' , 'html', 'login.html'));
    }
});

app.use('/game/maze', (req, res) => {
    if(req.session.user){
        res.sendFile(path.join(__dirname, 'views', 'htmlGames', 'maze.html'));
    }
    else{
        res.sendFile(path.join(__dirname, 'views' , 'html', 'login.html'));
    }
});

app.use('/game/four-in-a-row', (req, res) => {
    if(req.session.user){
        res.sendFile(path.join(__dirname, 'views', 'htmlGames', 'four-in-a-row.html'));
    }
    else{
        res.sendFile(path.join(__dirname, 'views' , 'html', 'login.html'));
    }
});
  
app.use('/game/memory-game', (req, res) => {
    if(req.session.user){
        res.sendFile(path.join(__dirname, 'views', 'htmlGames', 'memory-card.html'));
    }
    else{
        res.sendFile(path.join(__dirname, 'views' , 'html', 'login.html'));
    }
});
  
app.use('/game/simon-game', (req, res) => {
    if(req.session.user){
        res.sendFile(path.join(__dirname, 'views', 'htmlGames', 'simon-game.html'));
    }
    else{
        res.sendFile(path.join(__dirname, 'views' , 'html', 'login.html'));
    }
});
  
app.use('/game/soduko', (req, res) => {
    if(req.session.user){
        res.sendFile(path.join(__dirname, 'views', 'htmlGames', 'soduko.html'));
    }
    else{
        res.sendFile(path.join(__dirname, 'views' , 'html', 'login.html'));
    }
});
  
app.use('/game/checkers', (req, res) => {
    if(req.session.user){
        res.sendFile(path.join(__dirname, 'views', 'htmlGames', 'checkers.html'));
    }
    else{
        res.sendFile(path.join(__dirname, 'views' , 'html', 'login.html'));
    }
});
  
app.use('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'views' , 'html', 'admin.html'));
});

app.use('/user' , (req, res) => {
    res.sendFile(path.join(__dirname, 'views' , 'html', 'market.html'));
});


app.use('/login', (req, res) => {
    if(req.session.user && req.session.user.username === 'admin'){
        res.sendFile(path.join(__dirname, 'views' , 'html', 'admin.html'));
    }
    else if(req.session.user){
        res.sendFile(path.join(__dirname, 'views' , 'html', 'market.html'));
    }
    else {
    res.sendFile(path.join(__dirname, 'views' , 'html', 'login.html'));
    }
});

app.use('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views' , 'html', 'home.html'));
});

const port = 3000;
app.listen(port, () => console.log(`Server started on port ${port}`));
