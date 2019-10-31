const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose'); // communicate to mongo
const session = require('express-session');
const MongoStore = require('connect-mongo')(session); //store login session in mongodb

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_LOCAL_URI, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('connected to database'))

var app = express();
app.set('port', process.env.port || 8080);

// mongoose-session
app.use(session({
    secret: '10$nf2EmFNb3GLK',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ 
         mongooseConnection: db, 
         ttl: 14 * 24 * 60 * 60
    }) // TODO: Secret should come from environment variable
}));

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json())

// routers
app.use(require('./routes'));

app.listen(app.get('port'), function() {
  console.log('app 1.0', 'port: ' + app.get('port'));
});

