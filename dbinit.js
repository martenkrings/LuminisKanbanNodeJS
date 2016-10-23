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
    console.log('Old boards removed.')
});

Column.remove({}, function(err){
    console.log('Old columns removed.')
});

Comment.remove({}, function(err){
    console.log('Old comments removed.')
});

Role.remove({}, function(err){
    console.log('Old roles removed')
});

RoleToUser.remove({}, function(err){
    console.log('Old role, user associations removed')
});

Story.remove({}, function(err){
    console.log('Old stories removed')
});

User.remove({}, function(err){
    console.log('Old users removed.')
});

var newAdmin = User ({
    username: 'admin',
    password: 'root',
    firstName: 'A',
    lastName: 'Dmin',
    email: 'admin@luminis.nl',
    isAdmin: true
});

newAdmin.save(function(err){
    log.console('Admin created')
});