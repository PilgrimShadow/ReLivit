let express = require('express');
let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');
let checkAPI = require('express-validator/check');
let assert = require('assert');
let mongo = require('mongodb');

// Models
let users = require('./models/users');

// Create an instance for our app
let app = express();

// Set the process port
app.set('port', (process.env.PORT || 5000));

// Set the directory for static assets
app.use(express.static(__dirname + '/public'));

// Configure the views directory
app.set('views', __dirname + '/views');

// Configure the template engine
app.set('view engine', 'ejs');

// Parse cookies
app.use(cookieParser());

// Set up the body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Connect to the database and start the server
mongo.MongoClient.connect(process.env.MONGODB_URI, (err, database) => {

    // No error while connecting
    assert.equal(null, err);

    console.log('Connected to database');

    // Get reference to the database
    app.locals.db = database;

    // Start the server
    app.listen(app.get('port'), function () {
        console.log('Node app is running on port', app.get('port'));
    });
});

// Check for form validation errors
let validateForms = (req, res, next) => {

    const errors = checkAPI.validationResult(req);

    if (!errors.isEmpty()) {
        return res.json({errors: errors.mapped()});
    }

    next();
};

// Home page
app.get('/', function (request, response) {
    response.render('pages/index');
});

// Get the current users
app.get('/users', (req, res) => {

    res.send(req.body);
});

// Form validators
let firstnameValidator = checkAPI.body('firstname').trim().matches(/[\w]{1,20}/).withMessage('Between 1 and 20 letters');
let lastnameValidator = checkAPI.body('lastname').trim().matches(/[\w]{1,30}/).withMessage('Between 1 and 30 letters');
let usernameValidator = checkAPI.body('username').trim().matches(/^[\w\d]{5,20}$/).withMessage('Between 5 and 20 letters and digits');
let emailValidator = checkAPI.body('email').trim().isEmail().withMessage('Must be an email');
let aboutValidator = checkAPI.body('about').trim().matches(/[\w ]{0,140}/).withMessage('Only letters and spaces');

// Add a user
app.post('/users/add', [
        firstnameValidator,
        lastnameValidator,
        usernameValidator.exists(),
        emailValidator.exists(),
        aboutValidator,
        validateForms,
        users.add
    ],
);

// Update a user's email
app.post('/users/update/email', [
        emailValidator.exists(),
        validateForms,
        users.updateEmail
    ]
);

// Update a user's about message
app.post('/users/update/about', [
    aboutValidator.exists(),
    validateForms,
    users.updateAbout
]);