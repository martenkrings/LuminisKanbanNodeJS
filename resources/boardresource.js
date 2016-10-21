/**
 * Created by Marten on 10/11/2016.
 */
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var Board = require('../model/board.js');
var User = require('../model/user.js');
var Role = require('../model/role.js')

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
                    Board.find({_id: user.roles.boardId},{
                        _id: true,
                        title: true,
                        description: true,
                        dateCreated: true
                    }, function(err, result) {
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

            Board.find({},{title: true, description:true, dateCreated: true} , function(err, result) {
                if (err) {
                    res.status(400).json({error: 'Bad Request'});
                } else {
                    res.status(200).json(result);
                }
            })
        }
    })
});

router.get('/:boardid', function(req, res) {
    var token = req.header("token");
    jwt.verify(token, req.app.get('private-key'), function (err, decoded) {
        if (err) {
            res.status(401).json({error: 'Forbidden'});
        } else {
            User.findOne({username: decoded.username}, function(err, user) {
                if (err) {
                    res.status(400).json({error: 'Bad Request'});
                    Role.find({userId: user._id, boardId: req.params.boardId}, function(err, roleResult) {
                        if (err) {
                            res.status(400).json({error: 'Bad Request'});
                        } else if (roleResult.length > 0) {
                            res.status(401).json({error: 'Forbidden'});
                        }
                    });
                }
            });

            Board.findOne({_id: req.params.boardId}, function(err, result) {
                if (err) {
                    res.status(400).json({error: 'Bad Request'});
                } else {
                    res.status(200).json(result);
                }
            })
        }
    })
});

router.post('/edit', function(req, res) {
    var token = req.header("token");
    jwt.verify(token, req.app.get('private-key'), function (err, decoded) {
        if (err) {
            res.status(401).json({error: 'Forbidden'});
        } else {
            User.findOne({username: decoded.username}, function(err, user) {
                if (err) {
                    res.status(400).json({error: 'Bad Request'});
                    Role.find({userId: user._id, boardId: req.params.boardId}, function(err, roleResult) {
                        if (err) {
                            res.status(400).json({error: 'Bad Request'});
                        } else if (roleResult.length > 0) {
                            res.status(401).json({error: 'Forbidden'});
                        }
                    });
                }
            });

            Board.update({_id: req.body._id}, {'$set': {title: req.body.title, description: req.body.description}}, function(err) {
                if (err) {
                    res.status(400).json({'error': err.message});
                } else {
                    res.status(200).send("Data changed");
                }
            })
        }
    })
});

router.post('/')

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
                columns: [{
                    name: 'Backlog',
                    position: 0,
                    wipLimit: 0,
                    stories: []
                }, {
                    name: 'To-Do',
                    position: 1,
                    wipLimit: 0,
                    stories: []
                }, {
                    name: 'In Progress',
                    position: 2,
                    wipLimit: 0,
                    stories: []
                }, {
                    name: 'Done',
                    position: 3,
                    wipLimit: 0,
                    stories: []
                }],
                roles: [{
                    name: 'Observer'
                }, {
                    name: 'Product Owner',
                    manageStories: true
                }, {
                    name: 'Admin',
                    manageStories: true,
                    moveFrom: [{boardId: 0}, {boardId: 1}, {boardId: 2}, {boardId: 3}]
                }]
            });

            newBoard.save(function (err) {
                if (err) {
                    res.status(400).json({'error': err.message});
                    return
                }
                res.status(201).json();
            })
        }
    })
});

router.post('/addcolumn', function(req, res) {
    if (err) {
        res.status(401).json({error: 'Forbidden'});
    } else {
        User.findOne({username: decoded.username}, function (err, user) {
            if (err) {
                res.status(400).json({error: 'Bad Request'});
                Role.find({userId: user._id, boardId: req.params.boardId}, function (err, roleResult) {
                    if (err) {
                        res.status(400).json({error: 'Bad Request'});
                    } else if (roleResult.length > 0) {
                        res.status(401).json({error: 'Forbidden'});
                    }
                });
            }
        });
    }

    var newColumn = {
        name: req.body.name,
        position: req.body.position,
        wipLlimit: req.body.wipLimit,
        stories: []
    };

    Board.findOneAndUpdate({_id: req.params.boardId}, {$push: {columns: newColumn}}, function(err, result) {
        if (err) {
            res.status(400).json({error: 'Bad Request'});
        } else {
            res.status(200).json(result);
        }
    });

});

router.post('/addstory', function(req, res) {
    if (err) {
        res.status(401).json({error: 'Forbidden'});
    } else {
        User.findOne({username: decoded.username}, function (err, user) {
            if (err) {
                res.status(400).json({error: 'Bad Request'});
                Role.find({userId: user._id, boardId: req.params.boardId}, function (err, roleResult) {
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
        title: req.body.title,
        description: req.body.desccription,
        storyPoints: req.body.storyPoints,
        priority: req.body.priority,
        dateCreated: Date.now(),
        dateMoved: Date.now(),
        userIdCreated: req.body.userIdCreated,
        userIdLastMoved: req.body.userIdLastMoved,
        comments: []
    };

    Board.findOne({_id: req.params.boardId}, function(err, result) {
        if (err) {
            res.status(400).json({error: 'Bad Request'});
        } else {
            for (var i = 0; i < result.columns[i]; i++) {
                if (result.columns[i].position == req.body.columnPosition) {
                    result.columns[i].stories.push(newStory)
                }
            }

            result.save(function(err) {
                if (err) {
                    res.status(400).json({error: 'Bad Request'});
                } else {
                    res.status(200).json(result);
                }
            });
        }
    });

});

module.exports = router;