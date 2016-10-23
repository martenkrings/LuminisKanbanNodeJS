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
router.get('/', function(req, res) {
    var token = req.header("token");
    jwt.verify(token, req.app.get('private-key'), function (err, decoded) {
        if (err) {
            res.status(401).json({error: 'Forbidden'});
        } else {
            User.findOne({username: decoded.username}, function(err, user) {
                if (err) {
                    res.status(400).json({error: 'Bad Request'});
                } else {
                    Board.find({_id: user.roles.boardId}, function(err, result) {
                        if (err) {
                            res.status(400).json({error: 'Bad Request'});
                        } else {
                            res.status(200).json(result);
                        }
                    })
                }
            });
        }
    })
});

/**
 * Get all boards
 */
router.get('/all', function(req, res) {
    var token = req.header("token");
    jwt.verify(token, req.app.get('private-key'), function (err, decoded) {
        if (err) {
            res.status(401).json({error: 'Forbidden'});
        } else {
            User.findOne({username: decoded.username}, function(err, user) {
                if (err) {
                    res.status(400).json({error: 'Bad Request'});
                } else if (!user.isAdmin) {
                    res.status(401).json({error: 'Forbidden'});
                }
            });
        }

        Board.find({},{title: true, description:true, dateCreated: true} , function(err, result) {
            if (err) {
                res.status(400).json({error: 'Bad Request'});
            } else {
                res.status(200).json(result);
            }
        })
    })
});

/**
 * Get specific board by id
 */
router.get('/:boardid', function(req, res) {
    var token = req.header("token");
    jwt.verify(token, req.app.get('private-key'), function (err, decoded) {
        if (err) {
            res.status(401).json({error: 'Forbidden'});
        } else {
            User.findOne({username: decoded.username}, function(err, user) {
                if (err) {
                    res.status(400).json({error: 'Bad Request'});
                    RoleToUser.find({userId: user._id, boardId: req.params.boardId}, function(err, roleResult) {
                        if (err) {
                            res.status(400).json({error: 'Bad Request'});
                        } else if (roleResult.length > 0) {
                            res.status(401).json({error: 'Forbidden'});
                        }
                    });
                }
            });
        }

        Board.findOne({_id: req.params.boardId}, function(boardErr, boardResult) {
            if (boardErr) {
                res.status(400).json({error: 'Bad Request'});
            } else {
                Column.find({boardId: boardResult._id}, function(columnErr, columnResult) {
                    if (columnErr) {
                        res.status(400).json({error: 'Bad Request'});
                    } else {
                        var stories = [];
                        for (var i = 0; i < columnResult.length; i++) {
                            stories.append(Story.find({columnId: columnResult[i]._id}, function(storyErr) {
                                if (storyErr) {
                                    res.status(400).json({error: 'Bad Request'});
                                }
                            }))
                        }

                        var result = [boardResult, columnResult, stories]
                        res.status(200).json(result);
                    }
                });
            }
        })
    })
});

/**
 * Edit board title and description with the specific board's id
 */
router.post('/edit', function(req, res) {
    var token = req.header("token");
    jwt.verify(token, req.app.get('private-key'), function (err, decoded) {
        if (err) {
            res.status(401).json({error: 'Forbidden'});
        } else {
            User.findOne({username: decoded.username}, function(err, user) {
                if (err) {
                    res.status(400).json({error: 'Bad Request'});
                    RoleToUser.find({userId: user._id, boardId: req.params.boardId}, function(err, roleResult) {
                        if (err) {
                            res.status(400).json({error: 'Bad Request'});
                        } else if (roleResult.length > 0) {
                            res.status(401).json({error: 'Forbidden'});
                        }
                    });
                }
            });
        }

        Board.update({_id: req.body._id}, {'$set': {title: req.body.title, description: req.body.description}}, function(err, result) {
            if (err) {
                res.status(400).json({'error': err.message});
            } else {
                res.status(200).send(result);
            }
        })
    })
});

/**
 * Edit column name and wip limit by columnid
 */
router.post('/editcolumn', function(req, res) {
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

    Column.update({_id: req.body._id}, {'$set': {name: req.body.name, wipLimit: req.body.wipLimit}}, function(err, result) {
        if (err) {
            res.status(400).json({'error': err.message});
        } else {
            res.status(200).send(result);
        }
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
 * Edit a role
 */
router.post('/editrole', function(req, res) {
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
        }, function(err, result) {
            if (err) {
                res.status(400).json({'error': err.message});
            } else {
                res.status(200).send(result);
            }
        })
    });
});

/**
 * Create a new board with the parameters in the body of the request
 */
router.post('/new', function(req, res) {
    var token = req.header("token");
    jwt.verify(token, req.app.get('private-key'), function (err, decoded) {
        if (err) {
            res.status(401).json({error: 'Forbidden'});
        } else {
            User.findOne({username: decoded.username}, function(err, user) {
                if (err) {
                    res.status(400).json({error: 'Bad Request'});
                } else if (!user.isAdmin) {
                    res.status(401).json({error: 'Forbidden'});
                }
            });

            var newBoard = Board ({
                title: req.body.title,
                description: req.body.description,
                dateCreated: Date.now(),
            });

            newBoard.save(function (err, result) {
                if (err) {
                    res.status(400).json({'error': err.message});
                } else {
                    var newBacklog = Column ({
                        boardId: result._id,
                        name: 'Backlog',
                        position: 0,
                        wipLimit: 0
                    });
                    var newToDo = Column ({
                        boardId: result._id,
                        name: 'To-Do',
                        position: 1,
                        wipLimit: 0
                    });
                    var newInProgress = Column ({
                        boardId: result._id,
                        name: 'In Progress',
                        position: 2,
                        wipLimit: 0
                    });
                    var newDone = Column ({
                        boardId: result._id,
                        name: 'Done',
                        position: 3,
                        wipLimit: 0
                    });

                    var columns = [];

                    var columnSaveHandler = function (err, columnresult) {
                        if (err) {
                            res.status(400).json({'error': err.message});
                        } else {
                            columns.push(columnresult._id)
                        }
                    };

                    newBacklog.save(columnSaveHandler());
                    newToDo.save(columnSaveHandler());
                    newInProgress.save(columnSaveHandler());
                    newDone.save(columnSaveHandler());

                    var newObserver = Role ({
                        boardId: result._id,
                        name: 'Observer'
                    });
                    var newProductOwner = Role ({
                        boardId: result._id,
                        name: 'Product Owner',
                        manageStories: true
                    });
                    var newBoardAdmin = Role ({
                        boardId: result._id,
                        name: 'Board Admin',
                        manageStories: true,
                        moveFrom: columns
                    });
                }
                res.status(201).json(result._id);
            })
        }
    })
});

/**
 * Create a new Column
 */
router.post('/addcolumn', function(req, res) {
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

    var newColumn = Column ({
        BoardId: req.body.boardId,
        name: req.body.name,
        position: req.body.position,
        wipLlimit: req.body.wipLimit
    });

    Column.find({boardId: req.body.boardId}, function(err, columnsResult) {
        if (err) {
            res.status(400).json({error: 'Bad Request'});
        } else {
            for (var i = 0; i < columnsResult.length; i++) {
                if (columnsResult[i].position >= req.body.position) {
                    Column.update({_id: columnsResult[i]._id}, {'$set': {position: columnsResult[i].position + 1}}, function(updateErr) {
                        if (err) {
                            res.status(400).json({error: 'Bad Request'});
                        }
                    })
                }
            }
        }
    });

    newColumn.save(function() {
        if (err) {
            res.status(400).json({'error': err.message});
            return
        }
        res.status(201).json();
    })

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

    var newStory = {
        columnId: req.body.columnId,
        title: req.body.title,
        description: req.body.desccription,
        storyPoints: req.body.storyPoints,
        priority: req.body.priority,
        dateCreated: Date.now(),
        dateMoved: Date.now(),
        userIdCreated: req.body.userIdCreated,
        userIdLastMoved: req.body.userIdLastMoved
    };

    newStory.save(function() {
        if (err) {
            res.status(400).json({'error': err.message});
            return
        }
        res.status(201).json();
    })
});

/**
 *
 */
router.post('/addrole', function(req, res) {
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

        var newRole = {
            boardId: req.body.boardId,
            name: req.body.name,
            manageStories: req.body.manageStories,
            moveFrom: req.body.moveFrom
        };

        newRole.save(function() {
            if (err) {
                res.status(400).json({'error': err.message});
                return
            }
            res.status(201).json();
        })
    });
});

module.exports = router;