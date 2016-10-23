/**
 * Created by Marten on 10/23/2016.
 */
var mongoose = require('mongoose');

var roleToUserSchema = new mongoose.Schema({
    userId: {type: String, required: true},
    boardId: {type: String, required: true},
    roleId: {type: String, required: true}
});

module.exports = mongoose.model('RoleToUser', roleToUserSchema);