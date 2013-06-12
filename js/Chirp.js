/**
 * Chirp v1.0. Tweets related features
 *
 * @author Pushpak Patel <https://github.com/pushpakpop>
 * License: GPLv3
 *
 */
var Chirp = (function (self) {

    self.tweetTemplate = Handlebars.compile($("#tweet-template").html());
    self.tweetThreadEl = $('#tweets');

    /**
     * Retrives the Home Timeline of the authenticated user.
     */
    self.getHomeTimeline = function () {
        $.ajax({
            url: "get_tweets.php",
            data: {
                type: 'home'
            },
            type: 'POST',
            success: function (data) {
                //fill the template with data from the json object
                ChirpUI.loadTweets(data);
                $("li a").removeClass("active");
                ChirpUI.hideLoader(); // hide animation on success

            },
            error: function () {
                ChirpUI.hideLoader(); // hide animation on success
                ChirpUI.showPopup(strings.errorGettingTweet);
            },
            beforeSend: function () {
                ChirpUI.showLoader(); // hide animation on success
            }
        });
    };

    /**
     * Retrives the User Timeline of the specified/authenticated user.
     * @param name of the user
     */
    self.getUserTimeline = function (name) {
        $.ajax({
            url: "get_tweets.php",
            data: {
                userName: name,
                type: 'followers'
            },
            type: 'POST',
            success: function (data) {

                if (data === "unauthorized") {
                    ChirpUI.hideLoader(); // hide animation and show message if user is not authorized to view the required timeline
                    ChirpUI.showPopup(strings.errorNotAuthorized);
                } else {
                    //fill the template with data from the json object
                    ChirpUI.loadTweets(data);
                    $("li a").removeClass("active");
                    $('#' + name).addClass('active');
                    ChirpUI.hideLoader(); // hide animation on success
                }

            },
            error: function () {
                ChirpUI.hideLoader(); // hide animation on success
                ChirpUI.showPopup(strings.errorGettingTweet);
            },
            beforeSend: function () {
                ChirpUI.showLoader(); // hide animation on success

            }
        });
    };

    /**
     * Deletes the authenticated user's specified tweet.
     * @param id of the tweet to be deleted
     */
    self.deleteTweet = function (id) {
        $.ajax({
            type: 'POST',
            url: 'tweet_operations.php',
            data: {
                statusId: id,
                action: "delete"
            },
            success: function (data) {
                if (data.status) {
                    $('#' + id).remove();
                    ChirpUI.showPopup(strings.successDelete);
                } else {
                    ChirpUI.showPopup(strings.errorDeletingTweet);
                }
            },
            error: function () {
                ChirpUI.showPopup(strings.errorDeletingTweet);
            }
        });
    };

    /**
     * Retweets the specified tweet.
     * @param id of the tweet to be retweeted
     */
    self.reTweet = function (id) {
        $.ajax({
            type: 'POST',
            url: 'tweet_operations.php',
            data: {
                statusId: id,
                action: "retweet"
            },
            success: function (data) {
                if (data.status) {
                    ChirpUI.showPopup(strings.successRetweet);
                    ChirpUI.swapRetweetLink('retweet', id);
                } else {
                    ChirpUI.showPopup(strings.errorRetweet);
                }
            },
            error: function () {
                ChirpUI.showPopup(strings.errorRetweet);
            }
        });
    };

    /**
     * Deletes the retweet of the specific tweet done by the authenticated user.
     * @param id of the retweet to be undone/delete
     */
    self.undoRetweet = function (id) {
        $.ajax({
            type: 'POST',
            url: 'tweet_operations.php',
            data: {
                statusId: id,
                action: "undo_retweet"
            },
            success: function (data) {
                if (data.status) {
                    ChirpUI.swapRetweetLink('retweeted', id);
                    ChirpUI.showPopup(strings.successUndoRetweet);
                } else {
                    ChirpUI.showPopup(strings.errorUndoRetweet);
                }
            },
            error: function () {
                ChirpUI.showPopup(strings.errorUndoRetweet);
            }
        });
    };

    /**
     * Favorites the specified tweet
     * @param id of the tweet to be favorited
     */
    self.favoriteTweet = function (id) {
        $.ajax({
            type: 'POST',
            url: 'tweet_operations.php',
            data: {
                statusId: id,
                action: "favorite"
            },
            success: function (data) {
                if (data.status) {

                    ChirpUI.showPopup(strings.successFavorite);
                    ChirpUI.swapFavoriteLink('favorite', id);
                } else {
                    ChirpUI.showPopup(strings.errorFavoritingTweet);
                }
            },
            error: function () {
                ChirpUI.showPopup(strings.errorFavoritingTweet);
            }
        });
    };

    /**
     * Undo favorites specified tweet.
     * @param id of the tweet to be unfavorited
     */
    self.undoFavorite = function (id) {
        $.ajax({
            type: 'POST',
            url: 'tweet_operations.php',
            data: {
                statusId: id,
                action: "unfavorite"
            },
            success: function (data) {
                if (data.status) {
                    ChirpUI.showPopup(strings.successUndoFavorite);
                    ChirpUI.swapFavoriteLink('favorited', id);
                } else {
                    ChirpUI.showPopup(strings.errorUnFavoritingTweet);
                }
            },
            error: function () {
                ChirpUI.showPopup(strings.errorUnFavoritingTweet);
            }
        });
    };

    /**
     * Updates the status of the authenticated user.
     * @param status/tweet of the updated
     */
    self.updateStatus = function (status) {
        $.ajax({
            type: 'POST',
            url: 'tweet_operations.php',
            data: {
                tweet: status,
                statusId: 1,
                action: 'update'
            },
            success: function (data) {
                if (data.status) {
                    // get the home timeline
                    Chirp.getHomeTimeline();
                    $('#status').val(''); //empty the tweet text from textarea
					ChirpUI.showPopup(strings.successStatus);
                } else {
                    ChirpUI.hideLoader();
                    ChirpUI.showPopup(strings.errorUpdatingStatus);
                }
            },
            error: function () {
                ChirpUI.hideLoader();
                ChirpUI.showPopup(strings.errorUpdatingStatus);
            },
            beforeSend: function () {
                ChirpUI.showLoader(); // hide animation on success
            }
        });
    };

    /**
     * Generates a pdf file with the current tweets visible and prompts the user to download
     *
     */
    self.downloadTweets = function () {
        var content = $('#tweets').html();
        $.ajax({
            type: 'POST',
            url: 'generate_tweets_pdf.php',
            data: {
                'html': content
            },
            success: function (data) {
                if (data.status) {
                    ChirpUI.hideLoader(); //hide the loading proces
                    window.location = 'tweets.pdf'; //down the pdf file
                } else {
                    ChirpUI.hideLoader(); //hide the loading proces
                    ChirpUI.showPopup(strings.errorCreatingPdf);
                }
            },
            error: function () {
                ChirpUI.hideLoader(); //hide the loading proces
                ChirpUI.showPopup(strings.errorCreatingPdf);
            },
            beforeSend: function () {
                ChirpUI.showLoader(); // hide animation on success
            }
        });
    };

    /**
     * Converts text link,hashtags, and usernames to links
     * @param tweet text
     * returns the converted tweet
     */
    self.parseTweet = function (tweet) {
        //parse URL
        var str = tweet.replace(/[A-Za-z]+:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9-_:%&~\?\/.=]+/g, function (s) {
            return s.link(s);
        });
        //parse user_name
        str = str.replace(/[@]+[A-Za-z0-9_]+/g, function (s) {
            var userName = s.replace('@', '');
            return s.link("http://twitter.com/" + userName);
        });
        //parse hashtag
        str = str.replace(/[#]+[A-Za-z0-9_]+/g, function (s) {
            var hashTag = s.replace('#', '');
            return s.link("http://twitter.com/search?q=" + hashTag);
        });
        return str;
    };

    return self;
})(Chirp || {});