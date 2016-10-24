/**
 * Created by Marten on 10/11/2016.
 */
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var User = require('../model/user.js');
var Role = require('../model/role.js');
var RoleToUser = require('../model/roletouser.js');

router.get('/:userid', function (req, res) {
    var token = req.header("token");

    if (!token) {
        return res.status(401).json({error: 'No token provided, abandon ship!'});
    }

    jwt.verify(token, req.app.get('private-key'), function (err, decoded) {

        if (err) {
            return res.status(401).json({error: 'Forbidden'});
        }

        User.findOne({username: decoded.username}, function (err, user) {

            if (err) {
                return res.status(500).json({error: 'Server error.'});
            }

            if (!user) {
                return res.status(404).json({error: 'User not found.'})
            }

            User.findOne({_id: req.params.userId}, function (userErr, result) {
                if (userErr) {
                    return res.status(500).json({error: 'Server error.'});
                }

                if (!user) {
                    return res.status(404).json({error: 'User not found.'})
                }

                res.status(200).json({user: result});
            });
        });
    });
});

router.get('/:username', function (req, res) {
    var token = req.header("token");

    if (!token) {
        return res.status(401).json({error: 'No token provided, abandon ship!'});
    }

    jwt.verify(token, req.app.get('private-key'), function (err, decoded) {

        if (err) {
            return res.status(401).json({error: 'Forbidden'});
        }

        User.findOne({username: decoded.username}, function (err, user) {

            if (err) {
                return res.status(500).json({error: 'Server error.'});
            }

            if (!user) {
                return res.status(404).json({error: 'User not found.'});
            }

            if (!user.isAdmin) {
                return res.status(401).json({error: 'Forbidden'});
            }

            User.findOne({username: req.params.username}, function(err, result) {

                if (err) {
                    return res.status(500).json({error: 'Server error.'});
                }

                if (!result) {
                    return res.status(404).json({error: 'User not found.'});
                }

                res.status(200).json({message: 'User found!'});
            });
        });
    });
});

router.post('/giverole', function (req, res) {
    var token = req.header("token");

    if (!token) {
        return res.status(401).json({error: 'No token provided, abandon ship!'});
    }

    jwt.verify(token, req.app.get('private-key'), function (err, decoded) {

        if (err) {
            return res.status(401).json({error: 'Forbidden'});
        }

        User.findOne({username: decoded.username}, function (err, user) {
            if (err) {
                return res.status(500).json({error: 'Server error.'});
            }

            if (!user) {
                return res.status(404).json({error: 'User not found.'})
            }

            if (!user.isAdmin) {
                return res.status(401).json({error: 'Forbidden'});
            }

            User.findOne({_id: req.body.userId}, function(userErr, assignUser) {

                if (userErr) {
                    return res.status(500).json({error: 'Server error.'});
                }

                if (!assignUser) {
                    return res.status(404).json({error: 'User not found.'})
                }

                Role.findOne({_id: req.body.roleId}, function(roleErr, role) {
                    if (roleErr) {
                        return res.status(500).json({error: 'Server error.'});
                    }

                    if (!role) {
                        return res.status(404).json({error: 'Role not found.'})
                    }

                    var newRelation = RoleToUser({
                        userId: req.body.userId,
                        boardId: role.boardId,
                        roleId: req.body.roleId
                    });

                    newRelation.save(function (saveErr) {

                        if (saveErr) {
                            return res.status(500).json({error: 'Server error.'});
                        }

                        res.status(201).json();
                    });
                });
            });
        });
    });
});

module.exports = router;