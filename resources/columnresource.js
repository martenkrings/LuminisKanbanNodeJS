/**
 * Created by Marten on 10/23/2016.
 */
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var Column = require('../model/column.js');

router.post('/delete', function (req, res) {

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

            Column.remove({_id: req.body.columnId}, function (err) {
                if (err) {
                    res.status(400).json({error: 'Bad Request'});
                } else {
                    res.status(204)
                }
            });
        });
    });
});

/**
 * Edit column name and wip limit by columnid
 */
router.post('/editcolumn', function (req, res) {
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

            Column.update({_id: req.body._id}, {
                '$set': {
                    name: req.body.name,
                    wipLimit: req.body.wipLimit
                }
            }, function (err, result) {
                if (err) {
                    res.status(400).json({'error': err.message});
                } else {
                    res.status(200).send(result);
                }
            });
        });
    });
});

/**
 * Create a new Column
 */
router.post('/addcolumn', function (req, res) {
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

            var newColumn = Column({
                BoardId: req.body.boardId,
                name: req.body.name,
                position: req.body.position,
                wipLlimit: req.body.wipLimit
            });

            Column.find({boardId: req.body.boardId}, function (err, columnsResult) {

                if (err) {
                    return res.status(500).json({error: 'Server error.'});
                }

                for (var i = 0; i < columnsResult.length; i++) {

                    if (columnsResult[i].position >= req.body.position) {

                        Column.update({_id: columnsResult[i]._id}, {'$set': {position: columnsResult[i].position + 1}}, function (updateErr) {

                            if (updateErr) {
                                res.status(400).json({error: 'Bad Request'});
                            }
                        });
                    }
                }

                newColumn.save(function (err, result) {
                    if (err) {
                        return res.status(500).json({error: 'Server error.'});
                    }
                    res.status(201).json({edit: result});
                });
            });
        });
    });
});

module.exports = router;