/**
 * Created by Marten on 10/22/2016.
 */
var mongoose = require('mongoose');

var columnSchema = new mongoose.Schema({
    boardId: {type: String, required: true},
    name: {type: String, required: true},
    position: {type: Number, required: true},
    wipLimit: {type: Number, required: false}
});

module.exports = mongoose.model('Columnn', columnSchema);