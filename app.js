require('dotenv').config();

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');
const expressSession = require('express-session');

const connectDB = require('./server/config/db');
const { connect } = require('mongoose');
const {isActiveRoute } = require('./server/helpers/rounterHelpers');

const app = express();
const PORT = process.env.PORT || 5000;

//connect to db
connectDB();

app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));

const session = expressSession({
    secret: 'harinezumi',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    }),
});

//cookier: {maxAge: new Date ( Date.now() + (3600000) ) }
// }));

app.use(express.static('public'));

//Template Engine
app.use(expressLayouts);
app.set('layout','./layouts/main');
app.set('view engine','ejs');

app.locals.isActiveRoute = isActiveRoute;

app.use('/',require('./server/routes/main'));

app.use('/',require('./server/routes/admin'));


app.listen(PORT,()=> {
    console.log(`App listening on port ${PORT}`);
});