module.exports = (app, passport) => {
	const isAuthenticated = (req, res, next) => {
		if (req.isAuthenticated())
			return next();
		res.redirect('/login');
	}

	app.get('/', isAuthenticated, (req, res) => {
		user = req.user;
		console.log(user);
		res.render('mainPage', {user: user.dplName});
	});

	app.route('/login')
		.get( (req, res) => {
			res.render('login', {message: req.flash('message')});
		})
		.post(passport.authenticate('login', {
			successRedirect: '/',
			failureRedirect: '/login',
			failureFlash: true
		}));

	app.route('/signup')
		.get( (req, res) => {
			res.render('register', {message: req.flash('message')});
		})
		.post(passport.authenticate('signup', {
			successRedirect: '/',
			failureRedirect: '/signup',
			failureFlash: true
		}));

	app.get('/signout', (req, res) => {
		req.logout();
		res.redirect('/');
	})

}