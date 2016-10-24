/**
 * Created by Marten on 10/11/2016.
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

/**
 * Get all boards a specific user participates in
 */
router.get('/', function (req, res) {

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

            RoleToUser.find({userId: user._id}, function (relationErr, relations) {

                if (relationErr) {
                    return res.status(500).json({error: 'Server error.'});
                }

                if (!relations) {
                    return res.status(404).json({error: 'Relation to board not found.'})
                }

                Board.find({}, function (boardErr, boards) {

                    var resultBoards = [];

                    if (boardErr) {
                        return res.status(500).json({error: 'Server error.'});
                    }

                    if (!boards.length) {
                        return res.status(404).json({error: 'Board not found.'})
                    }

                    for (var i = 0; i < relations.length; i++) {

                        for (var j = 0; j < boards.length; j++) {

                            if (relations[i].boardId == boards[j]._id) {
                                resultBoards.push(boards[j]);
                            }
                        }
                    }
                    res.status(200).json({boards: resultBoards});
                });
            });
        });
    });
});

/**
 * Get all boards
 */
router.get('/all', function (req, res) {

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

            Board.find({}, {title: true, description: true, dateCreated: true}, function (err, result) {
                if (err) {
                    return res.status(500).json({error: 'Server error.'});
                }

                if (!result.length) {
                    return res.status(404).json({error: 'No boards found.'})
                }

                res.status(200).json({boards: result});

            });
        });
    });
});

/**
 * Get specific board by id
 */
router.get('/:boardId', function (req, res) {

    var token = req.header("token");
    var boardId = req.params.boardId;

    if (!token) {
        return res.status(401).json({error: 'No token provided, abandon ship!'});
    }

    jwt.verify(token, req.app.get('private-key'), function (err, decoded) {

        if (err) {
            return res.status(401).json({error: 'Forbidden'});
        }

        User.findOne({username: decoded.username}, function (err, user) {

            if (err) {
                return res.status(500).json({error: 'Server error, user error.'});
            }

            if (!user) {
                return res.status(404).json({error: 'User not found.'});
            }

            RoleToUser.find({'userId': user._id, 'boardId': boardId}, function (err, relationResult) {

                if (err) {
                    return res.status(400).json({error: 'Bad Request'});
                }

                if (! relationResult) {
                    return res.status(404).json({error: 'No permissions found.'});
                }

                if (! relationResult.length) {
                    return res.status(401).json({error: 'Forbidden'});
                }

                Board.findOne({'_id': boardId}, function (boardErr, boardResult) {

                    if (boardErr) {
                        return res.status(500).json({error: boardErr.message});
                    }

                    if (!boardResult) {
                        return res.status(404).json({error: 'Board not found.'});
                    }

                    Column.find({'boardId': boardResult._id}, function (columnErr, columnResult) {

                        if (columnErr) {
                            return res.status(500).json({error: 'Server error, column error.'});
                        }

                        if (!columnResult) {
                            return res.status(404).json({error: 'Columns not found.'})
                        }



                        Story.find({}, function (storyErr, stories) {
                            console.log(stories);
                            var storiesResult = [];

                            if (storyErr) {
                                return res.status(500).json({error: 'Server error, story error.'});
                            }

                            for (var i = 0; i < stories.length; i++) {

                                for (var j = 0; j < columnResult.length; j++) {

                                    if (stories[i].columnId == columnResult[j]._id) {
                                        storiesResult.push(stories[i]);
                                    }
                                }

                            }
                            var result = {'board': boardResult, 'columns': columnResult, 'stories': storiesResult};

                            res.status(200).json(result);

                        });
                    });
                });
            });
        });
    });
});

/**
 * Edit board title and description with the specific board's id
 */
router.post('/edit', function (req, res) {

    var token = req.header("token");

    if (!token) {
        return res.status(401).json({error: 'No token provided, abandon ship!'});
    }

    jwt.verify(token, req.app.get('private-key'), function (err, decoded) {

        if (err) {
            res.status(401).json({error: 'Forbidden'});
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

            Board.update({_id: req.body._id}, {
                '$set': {
                    title: req.body.title,
                    description: req.body.description
                }
            }, function (err, result) {

                if (err) {
                    return res.status(500).json({error: 'Server error.'});
                }

                res.status(200).send(result);

            });
        });
    });
});

/**
 * Create a new board with the parameters in the body of the request
 */
router.post('/new', function (req, res) {

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

            var newBoard = Board({
                title: req.body.title,
                description: req.body.description,
                dateCreated: Date.now()
            });

            newBoard.save(function (err, result) {

                if (err) {
                    return res.status(500).json({error: 'Server error.'});
                }

                for (var i = 0; i < req.body.columns; i++) {

                    var newColumn = Column({
                        boardId: result._id,
                        name: req.body.columns[i].name,
                        position: req.body.columns[i].position,
                        wipLimit: req.body.columns[i].wipLimit
                    });

                    newColumn.save(function (err) {
                        return res.status(500).json({error: 'Server error.'});
                    });

                }

                Column.find({boardId: result._id}, function (columnErr, columns) {

                    if (columnErr) {
                        return res.status(500).json({error: 'Server error.'});
                    }

                    for (var j = 0; j < req.body.roles; j++) {
                        var newRole = Role({
                            boardId: result._id,
                            name: req.body[j].name,
                            manageStories: req.body.manageStories,
                            moveFrom: []
                        });

                        for (var k = 0; k < req.body.moveFrom.length; k++) {

                            for (var l = 0; l < columns.length; l++) {

                                if (req.body.moveFrom[k].name == columns[l].name) {
                                    newRole.moveFrom.push()
                                }
                            }
                        }
                    }

                    res.status(201).json(result._id);

                });
            });
        });
    });
});

/**
 * Create a new role
 */
router.post('/addrole', function (req, res) {

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

            var newRole = Role({
                boardId: req.body.boardId,
                name: req.body.name,
                manageStories: req.body.manageStories,
                moveFrom: req.body.moveFrom
            });

            newRole.save(function () {
                if (err) {
                    res.status(400).json({'error': err.message});
                    return
                }
                res.status(201).json();
            });
        });
    });
});

/**
 * Edit a role
 */
router.post('/editrole', function (req, res) {
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

        Role.update({_id: req.body.roleId}, {
            '$set': {
                name: req.body.name,
                manageStories: req.body.manageStories,
                moveFrom: req.body.moveFrom
            }
        }, function (err, result) {
            if (err) {
                res.status(400).json({'error': err.message});
            } else {
                res.status(200).send(result);
            }
        })
    });
});

module.exports = router;