/**
 * Created by Marten on 10/23/2016.
 */
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var Board = require('../model/board.js');
var Column = require('../model/column.js');
var Comment = require('../model/comment.js');
var Role = require('../model/role.js');
var RoleToUser = require('../model/roletouser.js');
var Story = require('../model/story');
var User = require('../model/user.js');

router.get('/:columnid', function (req, res) {
    var token = req.header("token");
    jwt.verify(token, req.app.get('private-key'), function (err, decoded) {
        if (err) {
            res.status(401).json({error: 'Forbidden'});
        }
    });

    Story.find({columnId: req.params.columnid}, function (err, result) {
        if (err) {
            res.status(400).json({error: 'Bad Request'});
        } else {
            res.status(200).json(result);
        }
    })
});

router.post('/delete', function (req, res) {
    var token = req.header("token");
    jwt.verify(token, req.app.get('private-key'), function (err, decoded) {
        if (err) {
            res.status(401).json({error: 'Forbidden'});
        } else {
            User.findOne({username: decoded.username}, function (err, user) {
                if (err) {
                    res.status(400).json({error: 'Bad Request'});
                } else if (!user.isAdmin) {
                    res.status(401).json({error: 'Forbidden'});
                }
            });
        }
        Story.remove({_id: req.body.storyId}, function (err) {
            if (err) {
                res.status(400).json({error: 'Bad Request'});
            } else {
                res.status(204)
            }
        });
    })
});

/**
 * Edit or move a story
 */
router.post('/editstory', function(req, res) {
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

            Story.update({_id: req.body._id}, {
                '$set': {
                    columnId: req.body.columnId,
                    title: req.body.title,
                    description: req.body.description,
                    storyPoints: req.body.storyPoints,
                    priority: req.body.priority,
                    dateEdited: date.now(),
                    userIdLastMoved: user._id
                }
            }, function(err, result) {
                if (err) {
                    res.status(400).json({'error': err.message});
                } else {
                    res.status(200).send(result);
                }
            })
        });
    }
});

/**
 * Create a new story
 */
router.post('/addstory', function(req, res) {
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

    var newStory = Story({
        columnId: req.body.columnId,
        title: req.body.title,
        description: req.body.desccription,
        storyPoints: req.body.storyPoints,
        priority: req.body.priority,
        dateCreated: Date.now(),
        dateMoved: Date.now(),
        userIdCreated: req.body.userIdCreated,
        userIdLastMoved: req.body.userIdLastMoved
    });

    newStory.save(function() {
        if (err) {
            res.status(400).json({'error': err.message});
            return
        }
        res.status(201).json();
    })
});

module.exports = router;