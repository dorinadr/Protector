//Parse .env file
    const dotenv = require('dotenv');
    dotenv.config();
/*
//Include express classes
    const express = require('express');
//Instantiate handlers for http and https
    const http = require('http');
//express app instantiation
    const app = express();
    const httpServer = http.createServer(app);
//require custom router implementation for db example app
    const routerGen = require('./router');
//Middleware Definition 
    app.use(express.json());
    routerGen.gen(app);
//End Middleware definition

//Start Server
console.log("Starting up server on ports: "+process.env.PORT);
httpServer.listen(process.env.PORT,() => console.log('Server started listening on port: '+process.env.PORT));
*/
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');

const app = express();

// Passport Config
require('./config/passport')(passport);

// DB Config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true ,useUnifiedTopology: true}
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Express body parser
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Routes
app.use(express.static("./static"));
app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users.js'));



// Set Templating Enginge
app.set('view engine', 'ejs')



const PORT = process.env.PORT;

app.listen(PORT, console.log(`Server running on  ${PORT}`));

