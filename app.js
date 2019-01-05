//Simple NodeJs app to provide a REST api structure
const express = require("express");
const app = express();
//Morgan displays the logs in a good way. Middleware
const morgan = require("morgan");
//bodyParser gives access to req.body parameters userful in POST requests
const bodyParser = require("body-parser");
//Mongoose is a bridge between MongoDB and Node
const mongoose = require("mongoose");

//while connecting make sure to encode the users and password as well since the connection string will throw an error if special characters are present
//in the the user and password field.
mongoose.connect('mongodb+srv://'+encodeURIComponent("node-shop")+':'+encodeURIComponent("pass@123")+'@node-shop-wndrv.mongodb.net/test?retryWrites=true',{useNewUrlParser:true},(err,results) => {
   if(err) 
   console.log(err);
});
mongoose.Promise = global.Promise


//Set up the routes for all requests
const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/orders");
const userRoutes = require("./API/Routes/user");

//Morgan as said before displays the request information
//app.use is used to route the request through the middlewares
app.use(morgan("dev"));

//make the folder upload static to be able to be accessed through web
app.use('/uploads',express.static('uploads'));
//read description of body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//For CORS error it is used. Make sure to read up on it again
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
      return res.status(200).json({});
  }
  next();
});

// Routes which should handle requests
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/users",userRoutes);

//default cases where request structure doesn't match any case
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;
