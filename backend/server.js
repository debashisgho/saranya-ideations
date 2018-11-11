var expressApp = require('express'); 
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var sessions =  require('client-sessions');


//expressApp points to function createApplication
var app = expressApp();


//middleware

//use the bodyParser middleware to put the requested application/json in the body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//use client-sessions middleware for session management
app.use(sessions({
  cookieName: 'session', // cookie name dictates the key name added to the request object
  secret: 'blargadeeblargblarg', // should be a large unguessable string
  duration: 30 * 60 * 1000, // how long the session will stay valid in ms
  activeDuration: 1000 * 60 * 5 // if expiresIn < activeDuration, the session will be extended by activeDuration milliseconds
}));

//folder which will serve public files
app.use(expressApp.static(__dirname+'/dist/frontend'));

//connect to Database
var configDB = require('./config/db.js');
mongoose.connect(configDB.url, { useNewUrlParser: true } );
var db = mongoose.connection;


//load the routes
app.use(require('./routers/router'));


//start server
app.listen(80,function(){
	console.log('saranya-ideations node app server started with express - listening at port 80');
})



