const utilsHelper = require("./helpers/utils.helper");
var express = require('express');
require("dotenv").config();
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
console.log("DATA", process.env.DATABASE)


const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
}).then(() => {
    console.log(`Mongoose connected to ${process.env.DATABASE}`);
    require("./testing/testSchema");
  })



var indexRouter = require('./routes/index');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', indexRouter);


app.use((req, res, next) => {
    const err = new Error("Not Found");
    err.statusCode = 404;
    next(err);
  });
  
  /* Initialize Error Handling */
  app.use((err, req, res, next) => {
    console.log("ERROR", err);
    if (err.isOperational) {
      return utilsHelper.sendResponse(
        res,
        err.statusCode ? err.statusCode : 500,
        false,
        null,
        { message: err.message },
        err.errorType
      );
    } else {
      return utilsHelper.sendResponse(
        res,
        err.statusCode ? err.statusCode : 500,
        false,
        null,
        { message: err.message },
        "Internal Server Error"
      );
    }
  });
  
  module.exports = app;
