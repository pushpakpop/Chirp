/**
 * ChirpUI v1.0. UI related functions
 * 
 * @author Pushpak Patel <https://github.com/pushpakpop>
 * License: GPLv3
 * 
 */

var ChirpUI = (function(self){
	
	/**
	 * Set the speed for fadeOut function and duration for the setTimeout()
	 */
	self.config = 
	{
		speed: 400,
		duration: 2500,
	};
	
	/**
	 * Shows the loading.gif 
	 */
	self.loadingOverlay = $("#loading-overlay");
	self.showLoader = function() {
			self.loadingOverlay.css('display','block');                 
	};
	
	/**
	 * Hide the loadinggif
	 */
	self.hideLoader = function() {
		   self.loadingOverlay.css('display','none'); 
	};
	
	/**
	 * Shows notification
	 * @param notification message to be shown
	 */
	self.notification = $("#notification");
	self.showPopup = function(message) {
                        self.notification.find('#notification-msg').text(message);
                        self.notification.fadeIn(self.config.speed);
                        setTimeout(function() {self.notification.fadeOut(self.config.speed)},self.config.duration);                  
     };
	 
	 /**
	 * Populates the handlebar template with the tweets and shows tweets to user 
	 * @param tweets json object recieved from twitter
	 */
	 self.loadTweets = function(data) {
		 	var tweets = data; 
			var html = Chirp.tweetTemplate({ data : tweets});
			Chirp.tweetThread.html(html);
		 };
		 
	/**
	 * Swaps the retweet/retweeted link 
	 * @param type[retweet/retweeted] and the id of the tweet whose links are to be swaped
	 */
	self.swapRetweetLink = function(type,id) {
			
			if(type === "retweet")
			{
				var currentTweet = $('#'+id+' .retweet');
				currentTweet.removeClass('retweet');
				currentTweet.addClass('retweeted');
				currentTweet.text('Retweeted');
				currentTweet.attr('title','Undo Retweet');	
			}
			else
			{
				var currentTweet = $('#'+id+' .retweeted');
				currentTweet.removeClass('retweeted');
				currentTweet.addClass('retweet');
				currentTweet.text('Retweet');
				currentTweet.attr('title','Retweet');	
			}
		};
	
	/**
	 * Swaps the favorite/favorited link 
	 * @param type[favorite/favorited] and the id of the tweet whose links are to be swaped
	 */	
	self.swapFavoriteLink = function(type,id) {
		
			if(type === "favorite")
			{
				var currentTweet = $('#'+id+" .favorite");
				currentTweet.removeClass('favorite');
				currentTweet.addClass('favorited');
				currentTweet.text('favorited');
				currentTweet.attr('title','Undo Favorite');
			}
			else
			{
				var currentTweet = $('#'+id+" .favorited"); 
				currentTweet.removeClass('favorited');
				currentTweet.addClass('favorite');
				currentTweet.text('favorite');
				currentTweet.attr('title','favorite');
			}
		};
	 
	 /**
	 * Shows the modal containing the tweet that is to be retweeted 
	 */	
	 
	 self.retweetModal = $('#retweet-modal');
	 self.showRetweetModal = function(obj) {
			var tweetId = obj
			self.retweetId = tweetId.closest('.tweet').attr('id');
			var tweet = obj.closest('.tweet').html();
			self.retweetModal.children('.modal-body').html(tweet);
			self.retweetModal.modal('show');
	 };
	 
	 /**
	 * Shows the modal containing the tweet that is to be deleted
	 */	
	 self.deleteModal = $('#delete-modal');
	 self.showDeleteModal = function(obj) {
		 	var tweetId = obj;
			self.deleteId = tweetId.closest('.tweet').attr('id');
			var tweet = tweetId.closest('.tweet').html();
			self.deleteModal.children('.modal-body').html(tweet);
			self.deleteModal.modal('show');
		 }

	return self;
})(ChirpUI || {});