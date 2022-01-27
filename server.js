const express = require('express')
const app = express()
const port = 8080;
const ejs = require('ejs');
const expressLayout = require('express-ejs-layouts'); //to reuse the files in all the files such as header footer are same in all files
const path = require('path');
const session = require('express-session')
const mongoose = require('mongoose');
const flash = require('express-flash')
const mongoDbStore = require('connect-mongo');  //to store session
const passport = require('passport');
const Emitter = require('events')

//database connection
const url = 'mongodb+srv://dikshant23:asdfghjkl@cluster0.lucpx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

  async function db() {
	await mongoose.connect(url);

	 console.log("connected to db")
}

db();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(flash());//flash is used to define a flash message and render it without redirecting the request
 //whenever a message is flashed we will create a session by using req.flash();

 //event emitter

//session
 app.use(session({
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: false,
	store: mongoDbStore.create({
		mongoUrl: url,
		collectionName: 'sessions'
	}),
	cookie: { maxAge: 1000*60*60*24 } //24 hours
}))


 //passport
 const passportInit = require('./app/config/passport');
 passportInit(passport);
app.use(passport.initialize());
app.use(passport.session());

//console.log(passport.session)




//assets
app.set('views',path.join(__dirname,'/resources/views'));

app.use(express.static('public'));



app.use(( req , res , next) => { //global middleware to access every var anywehre for ex in hmtl
	
	//console.log(req.session);
	res.locals.session = req.session
	res.locals.user = req.user   //logged in user
	next();

 //res.locals is an object which stores local variables in res,req;
 })

app.set('view engine','ejs');
app.use(expressLayout);


const initRoutes = require('./routes/web.js');
initRoutes(app);


//set template engine

const server = app.listen(8080, ()=>{
    console.log(`Listening on port ${port}`);
})


