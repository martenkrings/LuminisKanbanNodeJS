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
            })
        });

    })
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
        });
    });

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

/**
 * Get specific board by id
 */
router.get('/:boardid', function (req, res) {

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
                return res.status(500).json({error: 'Server error'});
            }

            if (!user) {
                return res.status(404).json({error: 'User not found.'});
            }

            if (user.isAdmin == false) {
                return res.status(401).json({error: 'Forbidden'});
            }

            RoleToUser.find({userId: user._id, boardId: req.params.boardid}, function (err, roleResult) {

                if (err) {
                    return res.status(400).json({error: 'Bad Request'});
                }

                if (!roleResult) {
                    return res.status(404).json({error: 'No permissions found.'});
                }

                if (!roleResult.length) {
                    return res.status(401).json({error: 'Forbidden'});
                }

                Board.findOne({_id: req.params.boardId}, function (boardErr, boardResult) {

                    if (boardErr) {
                        return res.status(500).json({error: 'Server error'});
                    }

                    if (!boardResult) {
                        return res.status(404).json({error: 'Board not found.'});
                    }

                    Column.find({boardId: boardResult._id}, function (columnErr, columnResult) {

                        if (columnErr) {
                            return res.status(500).json({error: 'Server error'});
                        }

                        if (!columnResult) {
                            return res.status(404).json({error: 'Columns not found.'})
                        }

                        var stories = [];

                        for (var i = 0; i < columnResult.length; i++) {

                            stories.push(Story.find({columnId: columnResult[i]._id}, function (storyErr) {

                                if (storyErr) {
                                    return res.status(500).json({error: 'Server error'});
                                }

                            }))
                        }

                        var result = [boardResult, columnResult, stories];

                        res.status(200).json(result);

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
        });
    });

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

    })
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
        });
    });

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

            newColumn.save()
        }
        var newBacklog = Column({
            boardId: result._id,
            name: 'Backlog',
            position: 0,
            wipLimit: 0
        });
        var newToDo = Column({
            boardId: result._id,
            name: 'To-Do',
            position: 1,
            wipLimit: 0
        });
        var newInProgress = Column({
            boardId: result._id,
            name: 'In Progress',
            position: 2,
            wipLimit: 0
        });
        var newDone = Column({
            boardId: result._id,
            name: 'Done',
            position: 3,
            wipLimit: 0
        });
        newBacklog.save(columnSaveHandler(err, columnResult));
        newToDo.save(columnSaveHandler(err, columnResult));
        newInProgress.save(columnSaveHandler(err, columnResult));
        newDone.save(columnSaveHandler(err, columnResult));

        var newObserver = Role({
            boardId: result._id,
            name: 'Observer'
        });
        var newProductOwner = Role({
            boardId: result._id,
            name: 'Product Owner',
            manageStories: true
        });
        var newBoardAdmin = Role({
            boardId: result._id,
            name: 'Board Admin',
            manageStories: true,
        });

        var roleSaveHandler = function (err, roleresult) {
            if (err) {
                res.status(400).json({'error': err.message});
            }
        };

        newObserver.save(roleSaveHandler(err))
        newProductOwner.save(roleSaveHandler(err))
        newBoardAdmin.save(roleSaveHandler(err))

        res.status(201).json(result._id);
    })


});

/**
 * Create a new role
 */
router.post('/addrole', function (req, res) {
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
        })
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