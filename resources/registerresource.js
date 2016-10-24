/**
 * Created by Marten on 10/11/2016.
 */
var express = require('express');
var router = express.Router();
var User = require('../model/user.js');

router.post('/', function (req, res){
    var newUser = User ({
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email
    });

    newUser.save(function (err){
        if (err) {
            res.status(400).json({'error': err.message});
            return
        }
        res.status(201).json();
    })
});

module.exports = router;