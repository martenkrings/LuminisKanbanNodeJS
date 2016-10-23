/**
 * Created by Marten on 10/11/2016.
 */
var mongoose = require('mongoose');

var boardSchema = new mongoose.Schema({
    title: {type: String, required: true, unique: true},
    description: {type: String, required: true},
    dateCreated: {type: Date, default: Date.now()}
});

module.exports = mongoose.model('Board', boardSchema);