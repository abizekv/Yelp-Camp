const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('user/register');
};

module.exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, (err) => {
            if (err)  return next(err); 
            req.flash('success', 'Welcome to YelpCamp!');
            res.redirect('/campgrounds');
        });

    } catch (err) {
        req.flash('error', err.message);
        res.redirect('/register');
    }
};

module.exports.renderLogin = (req, res) => {
    res.render('user/login');
};

module.exports.login = (req, res) => {
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    req.flash('success', 'Welcome Back!');
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err)
        }
        req.flash('success', 'Succesfully logged out!');
        res.redirect('/campgrounds');
    });

};
