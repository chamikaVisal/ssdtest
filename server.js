
const express = require('express')
// const request = require('request-promise');
var cors = require('cors');

const app = express()
var router = express.Router();

const passport = require('passport')

var mongoose = require('mongoose');
var bodyparser = require('body-parser');

const session = require('express-session')

const User = require('./models/fbUser')

const facebookStrategy = require('passport-facebook').Strategy



//DB connection

const dbURL = "mongodb+srv://chamika:Asd123+++@afcluster1-3t6tc.mongodb.net/test";

mongoose
    .connect(dbURL, { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true })
    .then(() => console.log("mongodb connected"))
    .catch(err => console.log(err));

app.set("view engine","ejs")
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' }));
app.use(passport.initialize());
    app.use(passport.session()); 

// app.get("fb/login"){}
passport.use(new facebookStrategy({

    // pull in our app id and secret from our auth.js file
    clientID        : "870043757218073",
    clientSecret    : "f1522961c834b4d7e4f77e8ba09343f8",
    callbackURL     : "https://localhost:8080/facebook/callback",
    profileFields: ['id', 'displayName', 'name', 'gender', 'picture.type(large)','email']

},// facebook will send back the token and profile
function(token, refreshToken, profile, done) {

    //
    // asynchronous
    process.nextTick(function() {

      // find the user in the database based on their facebook id
      User.findOne({ uid : profile.id }, function(err, user) {

          // if there is an error, stop everything and return that
          // ie an error connecting to the database
          if (err)
              return done(err);

          // if the user is found, the  n log them in
          if (user) {
            router.get('    ', (req, res) => {
              console.log("enawa")
              const user = User.find().then(user => {
                  res.send(user);
              })
              console.log(user)
            })
              console.log("user found")
              console.log(user)
              return done(null, user); // user found, return that user
              
          } else {
              // if there is no user found with that facebook id, create them
              var newUser            = new User();

              // set all of the facebook information in our user model
              newUser.uid    = profile.id; // set the users facebook id                   
              newUser.token = token; // we will save the token that facebook provides to the user                    
              newUser.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
              newUser.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
              newUser.gender = profile.gender
              newUser.pic = profile.photos[0].value
              // save our user to the database
              newUser.save(function(err) {
                  if (err)
                      throw err;

                  // if successful, return the new user
                  return done(null, newUser);
              });
          }

      });

  })


}));



passport.serializeUser(function(user, done) {
    done(null, user.id);
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

app.get('/profile', isLoggedIn, function(req, res) {
  console.log("awooo")
    console.log(req.user)
   
    res.render('profile', {
        user : req.user // get the user out of session and pass to template
    });
});

// route middleware to make sure
function isLoggedIn(req, res, next) {
  console.log("awooo 2")
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

app.get('/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/profile',
            failureRedirect : '/'
        },
        ));

app.get('/',(req,res) => {
    res.render("index")
})
app.use(bodyparser.json());
app.use(cors());
app.use(function (req, res, next) {
    
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var fs = require("fs");
var http = require("http");
var https = require("https");

var options = {
  key: fs.readFileSync("./key.pem", "utf8"),
  cert: fs.readFileSync("./server.crt", "utf8"),
};


https.createServer(options, app).listen(8080, () => {
  console.log(options.key);
  console.log("server is listening on port 8080");
});
