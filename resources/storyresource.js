/**
 * Created by Marten on 10/23/2016.
 */
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var Story = require('../model/story.js');

router.get('/:columnid', function (req, res) {
    var token = req.header("token");
    jwt.verify(token, req.app.get('private-key'), function (err, decoded) {
        if (err) {
            res.status(401).json({error: 'Forbidden'});
        }
    });

    Story.find({columnId: req.params.columnid}, function (err, result) {
        if (err) {
            res.status(400).json({error: 'Bad Request'});
        } else {
            res.status(200).json(result);
        }
    })
});

router.post('/delete', function (req, res) {
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
        Story.remove({_id: req.body.storyId}, function (err) {
            if (err) {
                res.status(400).json({error: 'Bad Request'});
            } else {
                res.status(204)
            }
        });
    })
});

module.exports = router;