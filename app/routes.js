module.exports = (app, passport, userInfo) => {
	app.get('/', (req, res) => {
		if (req.isAuthenticated()) {
			res.render('mainPage', { name: userInfo.name});
		} else {
			res.redirect('/login');
		}
	});

	app.route('/login')
		.get( (req, res) => res.render('login'))
		.post(passport.authenticate('local', { failureRedirect: '/login', successRedirect: '/' }))

	app.route('/signup')
		.get( (req, res) => {
			res.render('signup');
		})
		.post( (req, res) => {
			console.log(res.body);
		})
}
