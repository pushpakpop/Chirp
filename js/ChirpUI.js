/**
 * ChirpUI v1.0. UI related functions
 *
 * @author Pushpak Patel <https://github.com/pushpakpop>
 * License: GPLv3
 *
 */
var ChirpUI = (function (self) {

    /**
     * Set the speed for fadeOut function and duration for the setTimeout()
     */
    self.config = {
        speed: 400,
        duration: 2500,
        maxDuration: 15000
    };
    self.loadingOverlayEl = $("#loading-overlay");
    self.notificationEl = $("#notification");
    self.retweetModalEl = $('#retweet-modal');
    self.deleteModalEl = $('#delete-modal');

    /**
     * Shows the loading.gif
     */

    self.showLoader = function () {
        self.loadingOverlayEl.css('display', 'block');
        setTimeout(function () {
            ChirpUI.hideLoader()
        }, self.config.maxDuration); // hide loader in 10sec if something goes wrong            
    };

    /**
     * Hide the loadinggif
     */
    self.hideLoader = function () {
        self.loadingOverlayEl.css('display', 'none');
    };

    /**
     * Shows notification
     * @param notification message to be shown
     */
    self.showPopup = function (message) {
        self.notificationEl.find('#notification-msg').text(message);
        self.notificationEl.fadeIn(self.config.speed);
        setTimeout(function () {
            self.notificationEl.fadeOut(self.config.speed)
        }, self.config.duration);
    };

    /**
     * Populates the handlebar template with the tweets and shows tweets to user
     * @param tweets json object recieved from twitter
     */
    self.loadTweets = function (data) {
        var tweets = data;
        var html = Chirp.tweetTemplate({
            data: tweets
        });
        Chirp.tweetThreadEl.html(html);
    };

    /**
     * Swaps the retweet/retweeted link
     * @param type[retweet/retweeted] and the id of the tweet whose links are to be swaped
     */
    self.swapRetweetLink = function (type, id) {

        if (type === "retweet") {
            var currentTweetEl = $('#' + id + ' .retweet');
            currentTweetEl.removeClass('retweet');
            currentTweetEl.addClass('retweeted');
            currentTweetEl.text('Retweeted');
            currentTweetEl.attr('title', 'Undo Retweet');
        } else {
            var currentTweetEl = $('#' + id + ' .retweeted');
            currentTweetEl.removeClass('retweeted');
            currentTweetEl.addClass('retweet');
            currentTweetEl.text('Retweet');
            currentTweetEl.attr('title', 'Retweet');
        }
    };

    /**
     * Swaps the favorite/favorited link
     * @param type[favorite/favorited] and the id of the tweet whose links are to be swaped
     */
    self.swapFavoriteLink = function (type, id) {

        if (type === "favorite") {
            var currentTweetEl = $('#' + id + " .favorite");
            currentTweetEl.removeClass('favorite');
            currentTweetEl.addClass('favorited');
            currentTweetEl.text('favorited');
            currentTweetEl.attr('title', 'Undo Favorite');
        } else {
            var currentTweetEl = $('#' + id + " .favorited");
            currentTweetEl.removeClass('favorited');
            currentTweetEl.addClass('favorite');
            currentTweetEl.text('favorite');
            currentTweetEl.attr('title', 'favorite');
        }
    };

    /**
     * Shows the modal containing the tweet that is to be retweeted
     */
    self.showRetweetModal = function (obj) {
        var tweetId = obj
        self.retweetId = tweetId.closest('.tweet').attr('id');
        var tweet = obj.closest('.tweet').html();
        self.retweetModalEl.children('.modal-body').html(tweet);
        self.retweetModalEl.modal('show');
    };

    /**
     * Shows the modal containing the tweet that is to be deleted
     */
    self.showDeleteModal = function (obj) {
        var tweetId = obj;
        self.deleteId = tweetId.closest('.tweet').attr('id');
        var tweet = tweetId.closest('.tweet').html();
        self.deleteModalEl.children('.modal-body').html(tweet);
        self.deleteModalEl.modal('show');
    }

    return self;
})(ChirpUI || {});