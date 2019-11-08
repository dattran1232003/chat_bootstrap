module.exports = (app, userInfo) => {
	app.get('/', (req, res) => {
		if (req.isAuthenticated()) {
			res.render('mainPage', { name: userInfo.name});
		} else {
			res.redirect('/login');
		}
	});
}