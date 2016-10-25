/**
 * Created by Marten on 10/11/2016.
 */
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var Board = require('../model/board.js');
var Column = require('../model/column.js');
var Role = require('../model/role.js');
var RoleToUser = require('../model/roletouser.js');
var Story = require('../model/story');
var User = require('../model/user.js');

/**
 * Get all boards a specific user participates in
 * requires a valid token
 */
router.get('/', function (req, res) {
    //get token
    var token = req.header("token");
    //check the existence of a token
    if (!token) {
        return res.status(401).json({error: 'No token provided, abandon ship!'});
    }
    //verify the token is valid
    jwt.verify(token, req.app.get('private-key'), function (err, decoded) {
        //if the token is invalid, tell the client it doesn't have access
        if (err) {
            return res.status(401).json({error: 'Forbidden'});
        }
        //find the user by the username contained in the token
        User.findOne({username: decoded.username}, function (err, user) {
            //if something went wrong, tell the client there was a client side error
            if (err) {
                return res.status(500).json({error: 'Server error.'});
            }
            //if no user could be found, tell the client the user couldn't be found
            if (!user) {
                return res.status(404).json({error: 'User not found.'})
            }
            //find the roles all the roles a user has with boards
            RoleToUser.find({userId: user._id}, function (relationErr, relations) {
                //if something went wrong, tell the client there was a client side error
                if (relationErr) {
                    return res.status(500).json({error: 'Server error.'});
                }
                //if no relation could be found, tell the client no relations could be found
                if (!relations) {
                    return res.status(404).json({error: 'Relation to board not found.'})
                }
                //get all boards
                Board.find({}, function (boardErr, boards) {
                    //prepare an array for the result
                    var resultBoards = [];
                    //if something went wrong, tell the client there was a client side error
                    if (boardErr) {
                        return res.status(500).json({error: 'Server error.'});
                    }
                    //if no boards could be found, tell the client no boards could be found
                    if (!boards.length) {
                        return res.status(404).json({error: 'Board not found.'})
                    }
                    //check my relations for the id of each board and add any board that occurs in the relations
                    for (var i = 0; i < relations.length; i++) {

                        for (var j = 0; j < boards.length; j++) {

                            if (relations[i].boardId == boards[j]._id) {
                                resultBoards.push(boards[j]);
                            }
                        }
                    }
                    //send the resulting board array to the client as a json object
                    res.status(200).json({boards: resultBoards});
                });
            });
        });
    });
});

/**
 * Get all boards
 * requires admin privileges
 */
router.get('/all', function (req, res) {
    //get token
    var token = req.header("token");
    //check the existence of a token
    if (!token) {
        return res.status(401).json({error: 'No token provided, abandon ship!'});
    }
    //verify the token is valid
    jwt.verify(token, req.app.get('private-key'), function (err, decoded) {
        //if the token is invalid, tell the client it doesn't have access
        if (err) {
            return res.status(401).json({error: 'Forbidden'});
        }
        //find the user by the username contained in the token
        User.findOne({username: decoded.username}, function (err, user) {
            //if something went wrong, tell the client there was a client side error
            if (err) {
                return res.status(500).json({error: 'Server error.'});
            }
            //if no user could be found, tell the client the user couldn't be found
            if (!user) {
                return res.status(404).json({error: 'User not found.'})
            }
            //if the user from the token isn't an admin, tell the client it doesn't have permission
            if (!user.isAdmin) {
                return res.status(401).json({error: 'Forbidden'});
            }

            Board.find({}, {title: true, description: true, dateCreated: true}, function (err, result) {
                //if something went wrong, tell the client there was a client side error
                if (err) {
                    return res.status(500).json({error: 'Server error.'});
                }
                //if no boards were found, tell the client no boards were found
                if (!result.length) {
                    return res.status(404).json({error: 'No boards found.'})
                }
                //send the resulting board array to the client as a json object
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

                if (!relationResult) {
                    return res.status(404).json({error: 'No permissions found.'});
                }

                if (!relationResult.length) {
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

    //Get the token from the request.
    var token = req.header("token");

    //If there is no token, return.
    if (!token) {
        return res.status(401).json({error: 'No token provided, abandon ship!'});
    }

    jwt.verify(token, req.app.get('private-key'), function (err, decoded) {

        if (err) {
            return res.status(401).json({error: 'Forbidden'});
        }

        User.findOne({username: decoded.username}, function (err, user) {
            if (err) {
                return res.status(500).json({error: 'Server error, user not found in token.'});
            }

            if (!user) {
                return res.status(404).json({error: 'User not found.'})
            }

            if (!user.isAdmin) {
                return res.status(401).json({error: 'Forbidden'});
            }

            var newBoard = Board({
                title: req.body.title,
                description: req.body.description
            });

            newBoard.save(function (err, board) {

                if (err) {
                    return res.status(500).json({error: err.message});
                }

                var columnResults = [];

                var columnsFromRequest = req.body.columns;

                for (var i = 0; i < columnsFromRequest.length; i++) {

                    var newColumn = Column({
                        boardId: board._id,
                        name: columnsFromRequest[i].name,
                        position: columnsFromRequest[i].position,
                        wipLimit: columnsFromRequest[i].wipLimit
                    });

                    columnResults.push(newColumn);

                }

                var roleResults = [];

                var rolesFromRequest = req.body.roles;

                for (var j = 0; j < rolesFromRequest.length; j++) {

                    var newRole = Role({
                        boardId: board._id,
                        name: rolesFromRequest[j].name,
                        manageStories: rolesFromRequest[j].manageStories,
                        moveFrom: []
                    });

                    for (var k = 0; k < columnResults; k++) {
                        if (rolesFromRequest[j].name == columnResults[k].name) {
                            newRole.moveFrom.push(columnResults[k]._id);
                        }
                    }

                    roleResults.push(newRole);

                }

                User.find({}, function (userErr, users) {
                    if (userErr) {
                        return res.status(500).json({error: err.message});
                    }

                    if (!users.length) {
                        return res.status(404).json({error: err.message});
                    }

                    var roleAssignments = [];

                    var roleAssignmentsFromRequest = req.body.rolAss;

                    for (var l = 0; l < users.length; l++) {
                        for (var m = 0; m < roleAssignmentsFromRequest.length; m++) {
                            for (var n = 0; n < roleResults.length; n++) {
                                if (users[l].username == roleAssignmentsFromRequest[m].username && roleResults[n].name == roleAssignmentsFromRequest[m].rolName) {

                                    var newRoleToUser = RoleToUser({
                                        userId: users[l]._id,
                                        boardId: board._id,
                                        roleId: roleResults[n]._id
                                    });

                                    roleAssignments.push(newRoleToUser);
                                }
                            }
                        }
                    }

                    for (var o = 0; o < columnResults.length; o++) {

                        columnResults[o].save(function (err) {
                            if (err) {
                                return res.status(500).json({error: err.message});
                            }

                            if (o == columnResults.length) {

                                for (var p = 0; p < roleResults.length; p++) {
                                    roleResults[p].save(function (err) {

                                        if (err) {
                                            return res.status(500).json({error: err.message});
                                        }
                                    });

                                    if (p == roleResults.length - 1) {

                                        for (var q = 0; q < roleAssignments.length; q++) {

                                            roleAssignments[q].save(function (err) {

                                                if (err) {
                                                    return res.status(500).json({error: err.message});
                                                }
                                            });
                                        }
                                    }
                                }
                            }

                        });
                    }
                    res.status(201).json({board: board});
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
                    return res.status(500).json({error: 'Server error.'});
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

            Role.update({_id: req.body.roleId}, {
                '$set': {
                    name: req.body.name,
                    manageStories: req.body.manageStories,
                    moveFrom: req.body.moveFrom
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

module.exports = router;