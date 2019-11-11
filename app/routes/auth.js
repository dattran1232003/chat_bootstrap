module.exports = (app, passport, conn) => {
	app.route('/login')
		.get( (req, res) => res.render('login'))
		.post(passport.authenticate('local', { failureRedirect: '/login', successRedirect: '/' }))

	app.route('/signup')
		.get( (req, res) => {
			res.render('signup');
		})
		.post( (req, res) => {
			const user = req.body;
			console.log(user);
			conn.query(`SELECT usrName from users where usrName='${user.username};'`, (err, results, field) => {
				
			})
			const sql = `INSERT INTO users(usrName, usrPwd, dplName) VALUES ('${user.username}', '${user.password}', '${user.CustomName}');`;
			conn.query(sql, (err) => {if (err) throw err});
		})
}