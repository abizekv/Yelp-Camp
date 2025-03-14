if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utilities/ExpressError');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const helmet = require('helmet');
const MongoStore = require('connect-mongo');



//imported routes    
const campgroundsRoutes = require('./routes/campground');
const reviewsRoutes = require('./routes/review');
const userRoutes = require('./routes/user');


const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/yelp-camp';

//mongoose
const mongoose = require('mongoose');
main().catch(err => console.log(err));
async function main() {
    await mongoose.connect(dbUrl);
    console.log('Mongoose connected [SUCCESS]')
}
//setting ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsMate);

//middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const secret = process.env.SECRET || 'notgoodsecret'

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: secret
    },
    touchAfter: 60 * 60 * 24,
});


store.on('error', (err) => {
    console.log('Session Store Error', err);
})

const sessionConfig = {
    store,
    name: 'session',
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
        // secure:true //works only over https
    }
}
app.use(session(sessionConfig));
app.use(flash());


const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
    "https://cdn.maptiler.com/",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",
    "https://cdn.maptiler.com/",
];
const connectSrcUrls = [
    "https://api.maptiler.com/",
];

const fontSrcUrls = [];

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            childSrc: ["blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dxoaqvrtb/",
                "https://images.unsplash.com",
                "https://api.maptiler.com/"
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);



//passport 
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

//routes
app.use('/', userRoutes);
app.use('/campgrounds', campgroundsRoutes);
app.use('/campgrounds/:id/reviews', reviewsRoutes);



app.get('/', (req, res) => {
    res.render('home');
});



// 404 handler   
app.all('*', (req, res, next) => {
    next(new ExpressError('404! Page Not found!', 404));
});

//custom error handler
app.use((err, req, res, next) => {
    const { status = 505 } = err;
    if (!err.message) err.message = 'Oops! Something Went Wrong';
    res.status(status).render('error.ejs', { err });
});


app.listen(9090, () => {
    console.log('Listening On Port 9090! [SUCCESS]')
})