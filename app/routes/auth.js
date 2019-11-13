module.exports = (app, passport, conn) => {
	const db = require('../models/db.js');
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
			const SelectInfo = {
				tables: 'users',
				columns: '*',
				where: `usrName='${user.username}'`
			};
			db.Select(SelectInfo, (err, results, fields) => {
				if (results.length === 1){
					res.redirect('/signup');
					return;
				} else {
					const InsertInfo = {
						tables: 'users',
						columns: ['usrName', 'usrPwd', 'dplName'],
						values: [user.username, user.password, user.CustomName]
					};
					db.Insert(InsertInfo, (err) => {if (err) throw err});
				}
			});

		})

}