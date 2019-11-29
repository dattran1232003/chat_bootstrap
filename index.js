const path			= require('path');
const mysql 		= require('mysql');
const bcrypt		= require('bcrypt');
const express 		= require('express');
const passport 		= require('passport');
const bodyParser 	= require('body-parser');
const flash 		= require('connect-flash');
const session 		= require('express-session');


const app = express();
// Application Setup
app.use(express.json());
app.use(bodyParser.urlencoded({ extend: true }));
app.use(session({ secret: 'mysecret', resave: false, saveUnitialized: true, cookie: { maxAge: 1000*60*5 } }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
// Application Template
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));



const server = require('http').Server(app);
const io = require('socket.io')(server);
const conn = mysql.createConnection({
	host	: 'localhost',
	user 	: 'root',
	password: '',
	database: 'chat',
	charset	: 'utf8mb4_unicode_ci'
});

conn.connect( (err) => {
	if (err) throw err;
	console.log('Success to connect to database');
});


/* -------------------------- */

var userInfo = {};

// Routes
//require('./app/routes.js')(app, passport, userInfo);
const authenticate = require('./app/models/authentication')(passport);
require('./app/routes/auth.js')(app, authenticate);


// Socket.io
io.on('connection', (socket) => {
	console.log(socket.id, 'is connected!');
	socket.on('disconnect', () => console.log(socket.id, 'is disconnected!'));
})

// Server listen
const port = process.env.PORT || 3000;
server.listen(port, () => console.log('Server is running at port', port));