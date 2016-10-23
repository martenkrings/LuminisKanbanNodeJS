/**
 * Created by Marten on 10/11/2016.
 */
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var User = require('../model/user.js');
var RoleToUser = require('../model/roletouser.js');

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

router.post('/giverole', function(req, res) {
    var token = req.header("token");
    jwt.verify(token, req.app.get('private-key'), function (err, decoded) {
        if (err) {
            res.status(401).json({error: 'Forbidden'});
        } else {
            User.findOne({username: decoded.username}, function (err, user) {
                if (err) {
                    res.status(400).json({error: 'Bad Request'});
                    RoleToUser.find({userId: user._id, boardId: req.params.boardId}, function (err, roleResult) {
                        if (err) {
                            res.status(400).json({error: 'Bad Request'});
                        } else if (roleResult.length > 0) {
                            res.status(401).json({error: 'Forbidden'});
                        }
                    });
                }
            });
        }

        var newRelation = RoleToUser({
            userId: req.body.userId,
            boardId: req.body.boardId,
            roleId: req.body.roleId
        });

        newRelation.save(function() {
            if (err) {
                res.status(400).json({'error': err.message});
                return
            }
            res.status(201).json();
        })
    })
});

module.exports = router;