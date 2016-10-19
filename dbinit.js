/**
 * Created by Marten on 10/11/2016.
 */
var Board = require('./model/board.js');
var User = require('./model/user.js');

Board.remove({}, function(err){
    console.log('Old boards removed.')
});

User.remove({}, function(err){
    console.log('Old users removed.')
});