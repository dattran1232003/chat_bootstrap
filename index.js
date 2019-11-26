const path			= require('path');
const mysql 		= require('mysql');
const express 		= require('express');
const passport 		= require('passport');
const bodyParser 	= require('body-parser');
const flash 		= require('connect-flash');
const session 		= require('express-session');
const LocalStrategy	= require('passport-local').Strategy;

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
require('./app/routes/auth.js')(app, passport);

// Login
passport.use('login', new LocalStrategy ({
		// using req object in callback function
		passReqToCallback : true
	},
	(req, username, password, done) => {
		const sql = `SELECT * FROM users WHERE usrName='${username}';`;
		conn.query(sql, (err, results, fields) => {
			if (err) throw err;
			// if user doesn't exist
			if (results.length < 1) {
				return done(null, false, 
					req.flash('message', 'User Not Found'));
			}
			const userRecord = results[0];
			// if password doesn't match
			if (password !== userRecord.usrPwd) {
				return done(null, false,
					req.flash('message', 'Invalid Password'));
			}
			// if everything's okey
			req.user = userRecord;
			return done(null, userRecord);
			
		})
	}
));

// signup
passport.use('signup', new LocalStrategy ( {
		passReqToCallback : true
	},
	(req, username, password, done) => {
		const sql = `SELECT * FROM users WHERE usrName='${username}';`;
		conn.query(sql, (err, results, fields) => {
			if (err) throw err;
			// if user already exist
			if (results.length >= 1) {
				return done (null, false,
					req.flash('message', 'User already exist'));
			}
			const newUser = {};
			newUser.username = username;
			newUser.password = password;
			newUser.dplName  = req.param('CustomName');

			// Save the user
			const sqlSave = 
				`INSERT INTO users(usrName, usrPwd, dplName) ` +
				`VALUES ('${newUser.username}', '${newUser.password}', '${newUser.dplName}');`;
			conn.query(sqlSave, (err, results) => {
				if (err) throw err;
				return done(null, newUser);
				console.log('User Registration succesful');
			})
		})
	}
));

//============================================

passport.serializeUser( (user, done) => {
	done(null, user.username);
});

passport.deserializeUser( (name, done) => {
	const sql = `SELECT * FROM users WHERE usrName='${name}';`;
	conn.query(sql, (err, results, fields) => {
		const user = results[0];
		return done(err, user);
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