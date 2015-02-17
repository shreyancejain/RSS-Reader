var http = require('http');
var config = require(__dirname + '/config.js');
var parseXML = require('xml2js').parseString;

var scrap = function (feed, callback) {

	http.get(feed.url, function (res) {
		var body = "";


		res.on('data', function (chunk) {
			body += chunk;
		});

		res.on('end', function () {
			// Got all response, now parsing...

			if (!body || res.statusCode !== 200)
				return callback({message: "Invalid Feed"});

			parseXML(body, function (err, rss) {
				if (err)
					return callback({message: "Invalid Feed"});

				feed = parseRSS(rss);
				if (!feed)
					return callback({message: "Invalid Feed"});
				callback(err, feed);
			});

		});

	}).on('error', function (error) {
		console.log("error while getting feed", error);
		callback(error, null);
	});

};


var parseRSS = function (rss) {
	try {
		var items = [];
		for (var i = 0; i < rss.rss.channel[0].item.length; i++) {
			items.push({
				title: rss.rss.channel[0].item[i].title[0],
				link: rss.rss.channel[0].item[i].link[0],
				description: rss.rss.channel[0].item[i].description[0],
				media: rss.rss.channel[0].item[i]['media:thumbnail'][1].$.url
			})
		}

		return {
			name: rss.rss.channel[0].title,
			description: rss.rss.channel[0].description,
			link: rss.rss.channel[0].link,
			image: rss.rss.channel[0].image[0].url[0],
			items: items
		};
	} catch (e) {
		return null;
	}
};

exports.get = function(url, callback){
	scrap({url:url},callback)
};