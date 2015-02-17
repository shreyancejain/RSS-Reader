var rssReader = angular.module('rssReader', []);

rssReader.factory('FeedApi', function ($http) {
    return {
        getFeed: function (url, callback) {
            return $http.get('/api/feed?url=' + url);
        }
    }
});

rssReader.controller('FeedController', function ($scope, FeedApi) {
    var self = this;
    self.newFeedUrl = "";
    self.getFeed = function (event) {
        if ((event.which == 13) || (event.keyCode == 13)) {
            event.preventDefault();
            FeedApi.getFeed(self.newFeedUrl).success(function(resp){
                self.title = resp.name[0];
                self.image = resp.image;
                self.description = resp.description[0];
                self.link = resp.link[0];
                self.items = resp.items;
            }).error(function(err){
                console.log("Error occurred : ", err)
            });
        }
    }
});


rssReader.filter('truncate', function () {
    return function (text, length, end) {
        if (isNaN(length))
            length = 10;

        if (length < 0)
            length = text.length;

        if (end === undefined)
            end = "...";

        if (text.length <= length || text.length - end.length <= length) {
            return text;
        }
        else {
            return String(text).substring(0, length - end.length) + end;
        }
    }
});
