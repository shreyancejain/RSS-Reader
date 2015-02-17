/**
 * Created by shreyance on 15/2/15.
 */

var config = require(__dirname + '/config.js');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var Feed = require(__dirname + '/feeds.js');

app.use(bodyParser());

app.use(express.static(__dirname + '/public'));
app.use(app.router);



app.get('/api/feed', function (req, res) {
    var url = req.param('url');
    if (!url || !url.match(config.urlRegex))
        return res.send(400, "Please provide a valid url");
    Feed.get(url, function (err, feed) {
        if (err)
            return res.send(400, "Invalid Feed");
        res.send(feed);
    });
});


app.listen(config.port);
console.log("Server started and listening on port " + config.port);
