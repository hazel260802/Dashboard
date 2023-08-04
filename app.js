const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors'); // Import the cors package

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Use the cors middleware to enable CORS for all routes
// For example: 
// app.use(cors({
//   origin: 'http://example.com', // Replace with the allowed origin
// }));

app.use(cors());

// Import the routes index file
const routes = require('./routes');

// Mount the routes
app.use('/', routes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500).json({
    error: {
      message: err.message,
    },
  });
});

app.listen(process.env.API_SERVER, () => {
  console.log(`Server is running on port: ${process.env.API_SERVER}`);
});

module.exports = app;
