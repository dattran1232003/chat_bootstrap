module.exports = (passport) => {
	const mysql = require('mysql');
	const LocalStrategy	= require('passport-local').Strategy;

	const conn = mysql.createConnection({
		host	: 'localhost',
		user 	: 'root',
		password: '',
		database: 'chat',
		charset	: 'utf8mb4_unicode_ci'
	});
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
				if (err) return next(err);
				if (password !== userRecord.usrPwd)
					return done(null, false,
						req.flash('message', 'Invalid Password'));
				
				// if everything's okey
				const newUser = {};
					newUser.username = userRecord.usrName;
					newUser.password = userRecord.usrPwd;
					newUser.dplName  = userRecord.dplName;
				req.user = newUser;
				return done(null, newUser);
				
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
				});
			});
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

	return passport;
}