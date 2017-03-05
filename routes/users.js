var express = require('express');
var router = express.Router();
var async = require('async');
var Xray = require('x-ray');
var x = Xray();
var output = [];
var request = require('request');

/* GET users listing. */
router.post('/', function(req, res, next) {
    var keyword = req.body.text;

    // get mp3.zing.vn link
    async.waterfall([
        async.apply(_getZingLink, keyword),
        _getZingSource
    ], function (err, result) {
        output = {
            "zing": result
        };

        res.json(output);
    });
});

function _getZingLink(searchKeyword, callback) {
    var searchZingLink = encodeURI(`http://mp3.zing.vn/tim-kiem/bai-hat.html?q=${searchKeyword}`);

    x(searchZingLink, {
        title: 'title',
        items: x('.item-song', [
            {
                title: '.title-song h3 a@title',
                id: '@data-id'
            }
        ])
    })(function(err, obj) {
        callback(null, obj.items);
    });
}

function _getZingSource(songList, callback) {
    async.map(songList, _getZingDetail, function(err, results) {
        var zingResult = results.filter(function(element) {
            return element !== undefined;
        });

        callback(null, zingResult);
    });
}

function _getZingDetail(item, callback) {
    request({
        uri: `http://api.mp3.zing.vn/api/mobile/song/getsonginfo?requestdata={"id": "${item.id}"}`
    }, function(err, response, body) {
        if (typeof JSON.parse(body).source['128'] != 'undefined') {
            var mySong = {
                "id": item.id,
                "title": item.title,
                "source": 'mp3.zing.vn',
                "download_link_128": JSON.parse(body).source['128']
            };
        }
        callback(err, mySong);
    });
}

module.exports = router;
