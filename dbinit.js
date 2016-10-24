/**
 * Created by Marten on 10/11/2016.
 */
var Board = require('./model/board.js');
var Column = require('./model/column.js');
var Comment = require('./model/comment.js');
var Role = require('./model/role.js');
var RoleToUser = require('./model/roletouser.js');
var Story = require('./model/story');
var User = require('./model/user.js');

Board.remove({}, function(err){
    if (err) {
        console.log(err.message)
    } else {
        console.log('Old boards removed.')
    }
});
Column.remove({}, function(err){
    if (err) {
        console.log(err.message)
    } else {
        console.log('Old columns removed.')
    }
});
Comment.remove({}, function(err){
    if (err) {
        console.log(err.message)
    } else {
        console.log('Old comments removed.')
    }
});
Role.remove({}, function(err){
    if (err) {
        console.log(err.message)
    } else {
        console.log('Old roles removed')
    }
});
RoleToUser.remove({}, function(err){
    if (err) {
        console.log(err.message)
    } else {
        console.log('Old role, user associations removed')
    }
});
Story.remove({}, function(err){
    if (err) {
        console.log(err.message)
    } else {
        console.log('Old stories removed')
    }
});
User.remove({}, function(err){
    if (err) {
        console.log(err.message)
    } else {
        console.log('Old users removed.')
    }
});

//Create users
var newAdmin = User ({
    username: 'admin',
    password: 'root',
    firstName: 'A',
    lastName: 'Dmin',
    email: 'admin@luminis.nl',
    isAdmin: true
});
var newUser1 = User ({
    username: 'sander',
    password: '123',
    firstName: 'Sander',
    lastName: 'Groot Wesseldijk',
    email: 'sander@luminis.nl'
});
var newUser2 = User ({
    username: 'jelmer',
    password: 'pass',
    firstName: 'Jelmer',
    lastName: 'Duzijn',
    email: 'jelmer@luminis.nl'
});
var newUser3 = User ({
    username: 'bastiaan',
    password: 'key',
    firstName: 'Bastiaan',
    lastName: 'van Schooten',
    email: 'bastiaan@luminis.nl'
});
var newUser4 = User ({
    username: 'marten',
    password: 'secret',
    firstName: 'Marten',
    lastName: 'Krings',
    email: 'sander@luminis.nl'
});

//Save users to database
newAdmin.save(function(err){
    if (err) {
        console.log(err.message)
    } else {
        console.log('Admin created')
    }
});
newUser1.save(function(err){
    if (err) {
        console.log(err.message)
    } else {
        console.log('Sander created')
    }
});
newUser2.save(function(err){
    if (err) {
        console.log(err.message)
    } else {
        console.log('Jelmer created')
    }
});
newUser3.save(function(err){
    if (err) {
        console.log(err.message)
    } else {
        console.log('Bastiaan created')
    }
});
newUser4.save(function(err){
    if (err) {
        console.log(err.message)
    } else {
        console.log('Marten created')
    }
});

//Create Boards
var newBoard1 = Board ({
    title: 'LuminisKanban',
    description: 'Het doel van dit project is een android applicatie te maken om Kanban te digitaliseren binnen Luminis',
    dateCreated: Date.now()
});
var newBoard2 = Board ({
    title: 'McDonals',
    description: 'LOL \n LOL \n LOL',
    dateCreated: Date.now()
});
var newBoard3 = Board ({
    title: 'Tijdelijk Project',
    description: 'Dit project is bedoeld om de functionaliteit van de applicatie te showcasen',
    dateCreated: Date.now()
});

//Save boards to database
newBoard1.save(function(err, board){
    var newColumn1 = Column ({
        boardId: board._id,
        name: 'Backlog',
        position: 0,
        wipLimit: 0
    });
    var newColumn2 = Column ({
        boardId: board._id,
        name: 'To-Do',
        position: 1,
        wipLimit: 0
    });
    var newColumn3 = Column ({
        boardId: board._id,
        name: 'In Progress',
        position: 2,
        wipLimit: 0
    });
    var newColumn4 = Column ({
        boardId: board._id,
        name: 'Done',
        position: 3,
        wipLimit: 0
    });

    var newObserver = Role ({
        boardId: board._id,
        name: 'Observer'
    });
    var newProductOwner = Role ({
        boardId: board._id,
        name: 'Product Owner',
        manageStories: true
    });
    var newBoardAdmin = Role ({
        boardId: board._id,
        name: 'Board Admin',
        manageStories: true,
        moveFrom: columns
    });

    var columns = [];

    newColumn1.save(function(columnErr, column) {
        if (columnErr) {
            console.log(columnErr.message)
        } else {
            User.findOne({username: 'jelmer'}, function(userErr, user) {
                if (userErr) {
                    console.log(userErr.message)
                } else {
                    var newStory1 = Story({
                        columnId: column._id,
                        title: 'Do thing 1',
                        description: 'Complete thing 1',
                        storyPoints: 3,
                        priority: 200,
                        dateCreated: Date.now(),
                        dateMoved: Date.now(),
                        userIdCreated: user._id,
                        userIdLastMoved: user._id
                    });
                    var newStory2 = Story({
                        columnId: column._id,
                        title: 'Do thing 2',
                        description: 'Complete thing 2',
                        storyPoints: 6,
                        priority: 190,
                        dateCreated: Date.now(),
                        dateMoved: Date.now(),
                        userIdCreated: user._id,
                        userIdLastMoved: user._id
                    });

                    newStory1.save(function(storyErr) {
                        if (storyErr) {
                            console.log(storyErr.message)
                        }
                    });
                    newStory2.save(function(storyErr) {
                        if (storyErr) {
                            console.log(storyErr.message)
                        }
                    });
                }
            });

            columns.push(column._id);
        }
    });
    newColumn2.save(function(err, column) {
        if (err) {
            console.log(err.message)
        } else {
            User.findOne({username: 'jelmer'}, function(userErr, user) {
                if (userErr) {
                    console.log(userErr.message)
                } else {
                    var newStory1 = Story({
                        columnId: column._id,
                        title: 'Do thing 3',
                        description: 'Complete thing 3',
                        storyPoints: 7,
                        priority: 150,
                        dateCreated: Date.now(),
                        dateMoved: Date.now(),
                        userIdCreated: user._id,
                        userIdLastMoved: user._id
                    });
                    var newStory2 = Story({
                        columnId: column._id,
                        title: 'Do thing 4',
                        description: 'Complete thing 4',
                        storyPoints: 13,
                        priority: 140,
                        dateCreated: Date.now(),
                        dateMoved: Date.now(),
                        userIdCreated: user._id,
                        userIdLastMoved: user._id
                    });

                    newStory1.save(function(storyErr) {
                        if (storyErr) {
                            console.log(storyErr.message)
                        }
                    });
                    newStory2.save(function(storyErr) {
                        if (storyErr) {
                            console.log(storyErr.message)
                        }
                    });
                }
            });

            columns.push(column._id);
        }
    });
    newColumn3.save(function(err, column) {
        if (err) {
            console.log(err.message)
        } else {
            User.findOne({username: 'jelmer'}, function(userErr, user) {
                if (userErr) {
                    console.log(userErr.message)
                } else {
                    var newStory1 = Story({
                        columnId: column._id,
                        title: 'Do thing 5',
                        description: 'Complete thing 5',
                        storyPoints: 1,
                        priority: 100,
                        dateCreated: Date.now(),
                        dateMoved: Date.now(),
                        userIdCreated: user._id,
                        userIdLastMoved: user._id
                    });
                    var newStory2 = Story({
                        columnId: column._id,
                        title: 'Do thing 6',
                        description: 'Complete thing 6',
                        storyPoints: 5,
                        priority: 90,
                        dateCreated: Date.now(),
                        dateMoved: Date.now(),
                        userIdCreated: user._id,
                        userIdLastMoved: user._id
                    });

                    newStory1.save(function(storyErr) {
                        if (storyErr) {
                            console.log(storyErr.message)
                        }
                    });
                    newStory2.save(function(storyErr) {
                        if (storyErr) {
                            console.log(storyErr.message)
                        }
                    });
                }
            });
            columns.push(column._id);
        }
    });

    newColumn4.save(function(err, column) {
        if (err) {
            console.log(err.message)
        } else {
            User.findOne({username: 'jelmer'}, function(userErr, user) {
                if (userErr) {
                    console.log(userErr.message)
                } else {
                    var newStory1 = Story({
                        columnId: column._id,
                        title: 'Do thing 7',
                        description: 'Complete thing 7',
                        storyPoints: 2,
                        priority: 50,
                        dateCreated: Date.now(),
                        dateMoved: Date.now(),
                        userIdCreated: user._id,
                        userIdLastMoved: user._id
                    });
                    var newStory2 = Story({
                        columnId: column._id,
                        title: 'Do thing 8',
                        description: 'Complete thing 8',
                        storyPoints: 3,
                        priority: 40,
                        dateCreated: Date.now(),
                        dateMoved: Date.now(),
                        userIdCreated: user._id,
                        userIdLastMoved: user._id
                    });

                    newStory1.save(function(storyErr) {
                        if (storyErr) {
                            console.log(storyErr.message)
                        }
                    });
                    newStory2.save(function(storyErr) {
                        if (storyErr) {
                            console.log(storyErr.message)
                        }
                    });
                }
            });
            columns.push(column._id);
        }
    });

    newObserver.save(function(err) {
        if (err) {
            console.log(err.message)
        }
    });
    newProductOwner.save(function(err) {
        if (err) {
            console.log(err.message)
        }
    });
    newBoardAdmin.save(function(err) {
        if (err) {
            console.log(err.message)
        }
    });

    User.findOne({username: 'sander'}, function(userErr, user) {
        if (userErr) {
            console.log(err.message)
        } else {
            Role.findOne({boardId: board._id, name: 'Observer'}, function (roleErr, role) {
                if (roleErr) {
                    console.log(err.message)
                } else {
                    var newRoleToUser = RoleToUser ({
                        userId: user._id,
                        boardId: board._id,
                        roleId: role._id
                    });

                    newRoleToUser.save(function() {
                        if (err) {
                            console.log(err.message)
                        }
                    })
                }
            })
        }
    });
    User.findOne({username: 'jelmer'}, function(userErr, user) {
        if (userErr) {
            console.log(err.message)
        } else {
            Role.findOne({boardId: board._id, name: 'Product Owner'}, function (roleErr, role) {
                if (roleErr) {
                    console.log(err.message)
                } else {
                    var newRoleToUser = RoleToUser ({
                        userId: user._id,
                        boardId: board._id,
                        roleId: role._id
                    });

                    newRoleToUser.save(function() {
                        if (err) {
                            console.log(err.message)
                        }
                    })
                }
            })
        }
    });
    User.findOne({username: 'bastiaan'}, function(userErr, user) {
        if (userErr) {
            console.log(err.message)
        } else {
            Role.findOne({boardId: board._id, name: 'Board Admin'}, function (roleErr, role) {
                if (roleErr) {
                    console.log(err.message)
                } else {
                    var newRoleToUser = RoleToUser ({
                        userId: user._id,
                        boardId: board._id,
                        roleId: role._id
                    });

                    newRoleToUser.save(function() {
                        if (err) {
                            console.log(err.message)
                        }
                    })
                }
            })
        }
    });

    console.log('Board1 created')
});
// newBoard2.save(function(err, board){
//     var newColumn1 = Column ({
//         boardId: board._id,
//         name: 'Backlog',
//         position: 0,
//         wipLimit: 0
//     });
//     var newColumn2 = Column ({
//         boardId: board._id,
//         name: 'To-Do',
//         position: 1,
//         wipLimit: 0
//     });
//     var newColumn3 = Column ({
//         boardId: board._id,
//         name: 'In Progress',
//         position: 2,
//         wipLimit: 0
//     });
//     var newColumn4 = Column ({
//         boardId: board._id,
//         name: 'Done',
//         position: 3,
//         wipLimit: 0
//     });
//
//     var newObserver = Role ({
//         boardId: board._id,
//         name: 'Observer'
//     });
//     var newProductOwner = Role ({
//         boardId: board._id,
//         name: 'Product Owner',
//         manageStories: true
//     });
//     var newBoardAdmin = Role ({
//         boardId: role._id,
//         name: 'Board Admin',
//         manageStories: true,
//         moveFrom: columns
//     });
//
//     newColumn1.save(function(err) {
//         if (err) {
//             console.log(err.message)
//         }
//     });
//     newColumn2.save(function(err) {
//         if (err) {
//             console.log(err.message)
//         }
//     });
//     newColumn3.save(function(err) {
//         if (err) {
//             console.log(err.message)
//         }
//     });
//     newColumn4.save(function(err) {
//         if (err) {
//             console.log(err.message)
//         }
//     });
//
//     newObserver.save(function(err) {
//         if (err) {
//             console.log(err.message)
//         }
//     });
//     newProductOwner.save(function(err) {
//         if (err) {
//             console.log(err.message)
//         }
//     });
//     newBoardAdmin.save(function(err) {
//         if (err) {
//             console.log(err.message)
//         }
//     });
//
//     User.findOne({username: 'jelmer'}, function(userErr, user) {
//         if (userErr) {
//             console.log(err.message)
//         } else {
//             Role.FindOne({boardId: board._id, name: 'Observer'}, function (roleErr, role) {
//                 if (roleErr) {
//                     console.log(err.message)
//                 } else {
//                     var newRoleToUser = RoleToUser ({
//                         userId: user._id,
//                         boardId: board._id,
//                         roleId: role._id
//                     });
//
//                     newRoleToUser.save(function() {
//                         if (err) {
//                             console.log(err.message)
//                         }
//                     })
//                 }
//             })
//         }
//     });
//     User.findOne({username: 'bastiaan'}, function(userErr, user) {
//         if (userErr) {
//             console.log(err.message)
//         } else {
//             Role.FindOne({boardId: board._id, name: 'Product Owner'}, function (roleErr, role) {
//                 if (roleErr) {
//                     console.log(err.message)
//                 } else {
//                     var newRoleToUser = RoleToUser ({
//                         userId: user._id,
//                         boardId: board._id,
//                         roleId: role._id
//                     });
//
//                     newRoleToUser.save(function() {
//                         if (err) {
//                             console.log(err.message)
//                         }
//                     })
//                 }
//             })
//         }
//     });
//     User.findOne({username: 'marten'}, function(userErr, user) {
//         if (userErr) {
//             console.log(err.message)
//         } else {
//             Role.FindOne({boardId: board._id, name: 'Board Admin'}, function (roleErr, role) {
//                 if (roleErr) {
//                     console.log(err.message)
//                 } else {
//                     var newRoleToUser = RoleToUser ({
//                         userId: user._id,
//                         boardId: board._id,
//                         roleId: role._id
//                     });
//
//                     newRoleToUser.save(function() {
//                         if (err) {
//                             console.log(err.message)
//                         }
//                     })
//                 }
//             })
//         }
//     });
//
//     console.log('Board2 created')
// });
// newBoard3.save(function(err, board){
//     var newColumn1 = Column ({
//         boardId: board._id,
//         name: 'Backlog',
//         position: 0,
//         wipLimit: 0
//     });
//     var newColumn2 = Column ({
//         boardId: board._id,
//         name: 'To-Do',
//         position: 1,
//         wipLimit: 0
//     });
//     var newColumn3 = Column ({
//         boardId: board._id,
//         name: 'In Progress',
//         position: 2,
//         wipLimit: 0
//     });
//     var newColumn4 = Column ({
//         boardId: board._id,
//         name: 'Done',
//         position: 3,
//         wipLimit: 0
//     });
//
//     var newObserver = Role ({
//         boardId: board._id,
//         name: 'Observer'
//     });
//     var newProductOwner = Role ({
//         boardId: board._id,
//         name: 'Product Owner',
//         manageStories: true
//     });
//     var newBoardAdmin = Role ({
//         boardId: role._id,
//         name: 'Board Admin',
//         manageStories: true,
//         moveFrom: columns
//     });
//
//     newColumn1.save(function(err) {
//         if (err) {
//             console.log(err.message)
//         }
//     });
//     newColumn2.save(function(err) {
//         if (err) {
//             console.log(err.message)
//         }
//     });
//     newColumn3.save(function(err) {
//         if (err) {
//             console.log(err.message)
//         }
//     });
//     newColumn4.save(function(err) {
//         if (err) {
//             console.log(err.message)
//         }
//     });
//
//     newObserver.save(function(err) {
//         if (err) {
//             console.log(err.message)
//         }
//     });
//     newProductOwner.save(function(err) {
//         if (err) {
//             console.log(err.message)
//         }
//     });
//     newBoardAdmin.save(function(err) {
//         if (err) {
//             console.log(err.message)
//         }
//     });
//
//     User.findOne({username: 'bastiaan'}, function(userErr, user) {
//         if (userErr) {
//             console.log(err.message)
//         } else {
//             Role.FindOne({boardId: board._id, name: 'Observer'}, function (roleErr, role) {
//                 if (roleErr) {
//                     console.log(err.message)
//                 } else {
//                     var newRoleToUser = RoleToUser ({
//                         userId: user._id,
//                         boardId: board._id,
//                         roleId: role._id
//                     });
//
//                     newRoleToUser.save(function() {
//                         if (err) {
//                             console.log(err.message)
//                         }
//                     })
//                 }
//             })
//         }
//     });
//     User.findOne({username: 'marten'}, function(userErr, user) {
//         if (userErr) {
//             console.log(err.message)
//         } else {
//             Role.FindOne({boardId: board._id, name: 'Product Owner'}, function (roleErr, role) {
//                 if (roleErr) {
//                     console.log(err.message)
//                 } else {
//                     var newRoleToUser = RoleToUser ({
//                         userId: user._id,
//                         boardId: board._id,
//                         roleId: role._id
//                     });
//
//                     newRoleToUser.save(function() {
//                         if (err) {
//                             console.log(err.message)
//                         }
//                     })
//                 }
//             })
//         }
//     });
//     User.findOne({username: 'sander'}, function(userErr, user) {
//         if (userErr) {
//             console.log(err.message)
//         } else {
//             Role.FindOne({boardId: board._id, name: 'Board Admin'}, function (roleErr, role) {
//                 if (roleErr) {
//                     console.log(err.message)
//                 } else {
//                     var newRoleToUser = RoleToUser ({
//                         userId: user._id,
//                         boardId: board._id,
//                         roleId: role._id
//                     });
//
//                     newRoleToUser.save(function() {
//                         if (err) {
//                             console.log(err.message)
//                         }
//                     })
//                 }
//             })
//         }
//     });
//
//     console.log('Board3 created')
// });