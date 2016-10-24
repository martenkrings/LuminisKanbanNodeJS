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

/**
 * Delete a story
 */
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

            Column.findOne({_id: req.body.storyId}, function (columnErr, column) {

                if (err) {
                    return res.status(500).json({error: 'Server error.'});
                }

                if (!column) {
                    return res.status(404).json({error: 'Column not found.'})
                }

                Board.findOne({_id: column.boardId}, function (boardErr, board) {

                    if (boardErr) {
                        return res.status(500).json({error: 'Server error.'});
                    }

                    if (!board) {
                        return res.status(404).json({error: 'Board not found.'})
                    }

                    RoleToUser.findOne({userId: user._id, boardId: board._id}, function (relationErr, relation) {

                        if (relationErr) {
                            return res.status(500).json({error: 'Server error.'});
                        }

                        if (!relation) {
                            return res.status(404).json({error: 'Relation not found.'})
                        }

                        Role.findOne({_id: relation.roleId}, function (roleErr, role) {

                            if (roleErr) {
                                return res.status(500).json({error: 'Server error.'});
                            }

                            if (!role) {
                                return res.status(404).json({error: 'Role not found.'})
                            }

                            if (role.manageStories) {
                                Story.remove({_id: req.body.storyId}, function (storyErr) {

                                    if (storyErr) {
                                        return res.status(500).json({error: 'Server error.'});
                                    }

                                    res.status(204)
                                });
                            }
                        });
                    });
                });
            });
        });
    });
});

/**
 * Edit a story
 */
router.post('/editstory', function (req, res) {
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

            Column.findOne({_id: req.body.storyId}, function (columnErr, column) {

                if (err) {
                    return res.status(500).json({error: 'Server error.'});
                }

                if (!column) {
                    return res.status(404).json({error: 'Column not found.'})
                }

                Board.findOne({_id: column.boardId}, function (boardErr, board) {

                    if (boardErr) {
                        return res.status(500).json({error: 'Server error.'});
                    }

                    if (!board) {
                        return res.status(404).json({error: 'Board not found.'})
                    }

                    RoleToUser.findOne({userId: user._id, boardId: board._id}, function (relationErr, relation) {

                        if (relationErr) {
                            return res.status(500).json({error: 'Server error.'});
                        }

                        if (!relation) {
                            return res.status(404).json({error: 'Relation not found.'})
                        }

                        Role.findOne({_id: relation.roleId}, function (roleErr, role) {

                            if (roleErr) {
                                return res.status(500).json({error: 'Server error.'});
                            }

                            if (!role) {
                                return res.status(404).json({error: 'Role not found.'})
                            }

                            if (role.manageStories) {
                                Story.update({_id: req.body._id}, {
                                    '$set': {
                                        title: req.body.title,
                                        description: req.body.description,
                                        storyPoints: req.body.storyPoints,
                                        priority: req.body.priority,
                                        dateEdited: date.now(),
                                        userIdLastMoved: user._id
                                    }
                                }, function (storyErr, result) {

                                    if (storyErr) {
                                        return res.status(500).json({error: 'Server error.'});
                                    }

                                    res.status(204).send(result);
                                });
                            }
                        });
                    });
                });
            });
        });
    });
});

/**
 * Create a new story
 */
router.post('/addstory', function (req, res) {
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

            Column.findOne({_id: req.body.columnId}, function (columnErr, column) {

                if (err) {
                    return res.status(500).json({error: 'Server error.'});
                }

                if (!column) {
                    return res.status(404).json({error: 'Column not found.'})
                }

                Board.findOne({_id: column.boardId}, function (boardErr, board) {

                    if (boardErr) {
                        return res.status(500).json({error: 'Server error.'});
                    }

                    if (!board) {
                        return res.status(404).json({error: 'Board not found.'})
                    }

                    RoleToUser.findOne({userId: user._id, boardId: board._id}, function (relationErr, relation) {

                        if (relationErr) {
                            return res.status(500).json({error: 'Server error.'});
                        }

                        if (!relation) {
                            return res.status(404).json({error: 'Relation not found.'})
                        }

                        Role.findOne({_id: relation.roleId}, function (roleErr, role) {

                            if (roleErr) {
                                return res.status(500).json({error: 'Server error.'});
                            }

                            if (!role) {
                                return res.status(404).json({error: 'Role not found.'})
                            }

                            if (role.manageStories) {
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

                                newStory.save(function (storyErr) {
                                    if (storyErr) {
                                        return res.status(500).json({error: 'Server error.'});
                                    }

                                    res.status(201).json();

                                });
                            }
                        });
                    });
                });
            });
        });
    });
});

/**
 * Move a story
 */
router.post('/movestory', function (req, res) {
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

            Column.findOne({_id: req.body.storyId}, function (columnErr, column) {

                if (err) {
                    return res.status(500).json({error: 'Server error.'});
                }

                if (!column) {
                    return res.status(404).json({error: 'Column not found.'})
                }

                Board.findOne({_id: column.boardId}, function (boardErr, board) {

                    if (boardErr) {
                        return res.status(500).json({error: 'Server error.'});
                    }

                    if (!board) {
                        return res.status(404).json({error: 'Board not found.'})
                    }

                    RoleToUser.findOne({userId: user._id, boardId: board._id}, function (relationErr, relation) {

                        if (relationErr) {
                            return res.status(500).json({error: 'Server error.'});
                        }

                        if (!relation) {
                            return res.status(404).json({error: 'Relation not found.'})
                        }

                        Role.findOne({_id: relation.roleId}, function (roleErr, role) {

                            if (roleErr) {
                                return res.status(500).json({error: 'Server error.'});
                            }

                            if (!role) {
                                return res.status(404).json({error: 'Role not found.'})
                            }

                            Story.findOne({_id: req.body._id}, function(storyErr, story) {

                                if (storyErr) {
                                    return res.status(500).json({error: 'Server error.'});
                                }

                                if (!story) {
                                    return res.status(404).json({error: 'Role not found.'})
                                }

                                if (role.moveFrom.contains(story.columnId)) {

                                    Columns.findOne({boardId: board._id, position: column.positon + 1}, function(columnsErr, columnTo) {

                                        if (columnsErr) {
                                            return res.status(500).json({error: 'Server error.'});
                                        }

                                        if (!columnTo) {
                                            return res.status(404).json({error: 'Column not found.'})
                                        }

                                        Story.update({_id: req.body._id}, {
                                            '$set': {
                                                columnId: columnTo._id
                                            }
                                        }, function (storyErr, result) {

                                            if (storyErr) {
                                                return res.status(500).json({error: 'Server error.'});
                                            }

                                            res.status(204).send(result);
                                        });
                                    });
                                }
                            });
                        });
                    });
                });
            });
        });
    });
});

router.post('/moveback', function (req, res) {
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

            Column.findOne({_id: req.body.storyId}, function (columnErr, column) {

                if (err) {
                    return res.status(500).json({error: 'Server error.'});
                }

                if (!column) {
                    return res.status(404).json({error: 'Column not found.'})
                }

                Board.findOne({_id: column.boardId}, function (boardErr, board) {

                    if (boardErr) {
                        return res.status(500).json({error: 'Server error.'});
                    }

                    if (!board) {
                        return res.status(404).json({error: 'Board not found.'})
                    }

                    RoleToUser.findOne({userId: user._id, boardId: board._id}, function (relationErr, relation) {

                        if (relationErr) {
                            return res.status(500).json({error: 'Server error.'});
                        }

                        if (!relation) {
                            return res.status(404).json({error: 'Relation not found.'})
                        }

                        Role.findOne({_id: relation.roleId}, function (roleErr, role) {

                            if (roleErr) {
                                return res.status(500).json({error: 'Server error.'});
                            }

                            if (!role) {
                                return res.status(404).json({error: 'Role not found.'})
                            }

                            Story.findOne({_id: req.body._id}, function(storyErr, story) {

                                if (storyErr) {
                                    return res.status(500).json({error: 'Server error.'});
                                }

                                if (!story) {
                                    return res.status(404).json({error: 'Role not found.'})
                                }

                                if (role.moveFrom.contains(story.columnId)) {

                                    Columns.findOne({boardId: board._id, position: 0}, function(columnsErr, columnTo) {

                                        if (columnsErr) {
                                            return res.status(500).json({error: 'Server error.'});
                                        }

                                        if (!columnTo) {
                                            return res.status(404).json({error: 'Column not found.'})
                                        }

                                        Story.update({_id: req.body._id}, {
                                            '$set': {
                                                columnId: columnTo._id
                                            }
                                        }, function (storyErr, result) {

                                            if (storyErr) {
                                                return res.status(500).json({error: 'Server error.'});
                                            }

                                            res.status(204).send(result);
                                        });
                                    });
                                }
                            });
                        });
                    });
                });
            });
        });
    });
});

module.exports = router;