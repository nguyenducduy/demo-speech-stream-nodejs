var express = require('express');
var router = express.Router();
var async = require('async');
var Xray = require('x-ray');
var _ = require('lodash');
var x = Xray({
    filters: {
        escape: function(value) {
            return escapeHtml(value);
        },
        forceStr: function(value) {
            return value.replace(/,/g, '');
        }
    }
});
var output = [];
var request = require('request');

/* GET users listing. */
router.post('/', function(req, res, next) {
    var keyword = req.body.text;

    // async.parallel({
    //     zing: function(callback) {
    //         // get mp3.zing.vn link
    //         async.waterfall([
    //             async.apply(_getZingLink, keyword),
    //             _getZingSource
    //         ], function(err, result) {
    //             callback(null, result);
    //         });
    //     },
    //     nhaccuatui: function(callback) {
    //         // get nhaccuatui.com link
    //         async.waterfall([
    //             async.apply(_getNhaccuatuiLink, keyword),
    //             _getNhaccuatuiSource
    //         ], function(err, result) {
    //             callback(null, result);
    //         });
    //     }
    // }, function(err, results) {
    //     // console.log(results);
    //     // results is now equals to: {one: 1, two: 2}
    // });

    // get mp3.zing.vn link
    async.waterfall([
        async.apply(_getZingLink, keyword),
        _getZingSource
    ], function (err, result) {
      res.json(result);
      res.end();
    });
});

// function _getNhaccuatuiLink(searchKeyword, callback) {
//     var searchLink = encodeURI(`http://www.nhaccuatui.com/tim-kiem/bai-hat?q=${searchKeyword}`);
//
//     x(searchLink, {
//         title: 'title',
//         items: x('.item_content', [{
//             title: 'h3 a@title | escape',
//             singer: '.name_singer',
//             id: 'h3 a@key',
//             link: 'h3 a@href',
//
//         }])
//     })(function(err, obj) {
//         callback(null, obj.items);
//     });
// }
//
// function _getNhaccuatuiSource(songList, callback) {
//     async.map(songList, _getNhaccuatuiDetail, function(err, results) {
//         var nhacncuatuiResult = results.filter(function(element) {
//             return element !== undefined;
//         });
//
//         callback(null, nhacncuatuiResult);
//     });
// }
//
// function _getNhaccuatuiDetail(item, callback) {
//     request({
//         uri: item.link
//     }, function(err, response, body) {
//         // console.log(body);
//         // callback(err, mySong);
//     });
// }

////////////////////////////////////////

function _getZingLink(searchKeyword, callback) {
    var searchLink = encodeURI(`http://mp3.zing.vn/tim-kiem/bai-hat.html?q=${searchKeyword}`);

    x(searchLink, {
        title: 'title',
        items: x('.item-song', [{
            title: '.title-song h3 a@title',
            id: '@data-id',
            listenCount: '.info-meta .fn-number | forceStr'
        }])
    })(function(err, obj) {
        callback(null, obj.items[0]);
    });
}

function _getZingSource(song, callback) {
    request({
        uri: `http://api.mp3.zing.vn/api/mobile/song/getsonginfo?requestdata={"id": "${song.id}"}`
    }, function(err, response, body) {
        if (typeof JSON.parse(body).source['128'] != 'undefined') {
            var mySong = {
                "id": song.id,
                "title": song.title,
                "source": 'mp3.zing.vn',
                "download_link_128": JSON.parse(body).source['128'],
                "listen_count": song.listenCount
            };
        }
        callback(err, mySong);
    });
}

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function sortListenCount(a, b) {
    if (a.listen_count < b.listen_count) {
        return -1;
    }

    if (a.listen_count > b.listen_count) {
        return 1;
    }

    return 0;
}

module.exports = router;
