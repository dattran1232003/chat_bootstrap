const mysql 		= require('mysql');
const express 		= require('express');
const passport 		= require('passport');
const bodyParser 	= require('body-parser');
const session 		= require('express-session');
const localStrategy	= require('passport-local').Strategy;

const app = express();
// Application Use
app.use(express.static('public'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extend: true }));
app.use(session({ secret: 'mysecret', resave: false, saveUnitialized: true, cookie: { maxAge: 1000*60*5 } }));
app.use(passport.initialize());
app.use(passport.session());
// Application Set 
app.set('view engine', 'ejs');
app.set('views', './views');



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
require('./app/routes/auth.js')(app, passport, conn);
require('./app/routes/page.js')(app, userInfo);

// Authenticate
passport.use(new localStrategy (
	(username, password, done) => {
		const sql = `SELECT * FROM users WHERE usrName='${username}';`;
		conn.query(sql, (err, results, fields) => {
			if (err) throw err;
			let userRecord = {};
			if (results.length >= 1) {
				userRecord = results[0];
				if (userRecord.usrPwd === password) {
					return done(null, userRecord);
				}
			}
			return done(null, false);
		})
	}
));

passport.serializeUser( (user, done) => {
	done(null, user.usrName);
});

passport.deserializeUser( (name, done) => {
	const sql = `SELECT * FROM users WHERE usrName='${name}';`;
	conn.query(sql, (err, results, fields) => {
		if (err) throw err;
		let userRecord = {};
		if (results.length >= 1) {
			userRecord = results[0];
			userInfo.name = userRecord.dplName;
			return done(null, userRecord);
		}
		return done(null, false);
	})
});

// Socket.io
io.on('connection', (socket) => {
	console.log(socket.id, 'is connected!');
	socket.on('disconnect', () => console.log(socket.id, 'is disconnected!'));
})

// Server listen
const port = process.env.PORT || 3000;
server.listen(port, () => console.log('Server is running at port', port));