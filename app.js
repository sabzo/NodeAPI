const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose'); // communicate to mongo
const Bcrypt = require('bcryptjs'); // password encryption
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
    store: new MongoStore({ 
         mongooseConnection: db, 
         ttl: 14 * 24 * 60 * 60
    }) // TODO: Secret should come from environment variable
}));

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json())

const User = require('./models/user');

app.get('/', function(req, res) {
  res.json({'success': true});
});

app.get('/test', (req, res) => {
  res.send('Hello world\n');
});

app.get('/user', (req, res) => {
  User.find(function(err, users) {
    console.log(users);  
  });
  res.json({ok: 200});
});

app.post('/user', (req, res) => {
  req.body.password = Bcrypt.hashSync(req.body.password, 10);
  var user = new User(req.body);
  user.save(function (err, u) {
    if (err) return console.log(err);
    console.log(u);
    res.send({ok: 200});
  });
});

app.post("/login", async (req, res) => {
    try {
        var user = await User.findOne({ email: req.body.email}).exec();
        if(!user) {
            return res.status(400).send({ message: "The email does not exist" });
        }
        console.log('json', req.body);
        console.log(user);
        if(!Bcrypt.compareSync(req.body.password, user.password)) {
            return res.status(400).send({ message: "The password is invalid" });
        }
        res.json({message: "welcome" });
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
 
});

app.listen(app.get('port'), function() {
  console.log('app 1.0', 'port: ' + app.get('port'));
});

