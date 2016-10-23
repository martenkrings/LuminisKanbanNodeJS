/**
 * Created by Marten on 10/11/2016.
 */
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var User = require('../model/user.js');

router.post('/', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;

    User.findOne({'username': username }, function (err, user) {
        if (err) {
            res.status(500).json({'error': 'Could not load user from database.'});
        } else {
            if (user.password == password) {
                var token = jwt.sign({username: username}, req.app.get('private-key'), {
                    expiresIn: 1440
                });
                res.status(201).json({token: token, isAdmin: user.isAdmin});
            } else {
                res.status(401).json({'error': 'Invalid Credentials'});
            }
        }
    });
});

module.exports = router;