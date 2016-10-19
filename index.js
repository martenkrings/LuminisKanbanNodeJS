/**
 * Created by Marten on 10/11/2016.
 */
var express = require('express');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
var app = express();

require('./dbinit');

app.set('private-key', 'luminissecretkey');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect('mongodb://localhost/luminiskanban');

var registerResource = require('./resources/registerresource.js');
app.use('/api/register', registerResource);

var logInResource = require('./resources/loginresource.js');
app.use('/api/login', logInResource);

var userResource = require('./resources/userresource.js');
app.use('/api/users', userResource);

var boardResource = require('./resources/boardresource.js');
app.use('/api/boards', boardResource);

app.listen(3000, function () {
    console.log('App listening on port 3000!');
});

/**
 * standard get to ensure setup went OK
 */
app.get('/', function (req, res) {
    res.send('Hello World!');
});