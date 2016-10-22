/**
 * Created by Marten on 10/11/2016.
 */
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var User = require('../model/user.js');

router.get('/:userid', function (req, res) {
    var token = req.header("token");
    jwt.verify(token, req.app.get('private-key'), function (err, decoded) {
        if (err) {
            res.status(401).json({error: 'Forbidden'});
        }

        User.findOne({_id: req.params.userId}, function (userErr, result) {
            if (userErr) {
                res.status(400).json({error: 'Bad Request'});
            } else {
                res.status(200).json(result);
            }
        });
    })
});

module.exports = router;