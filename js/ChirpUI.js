//ChirUI class. contains UI related methods
var ChirpUI = (function(self){
	
	self.config = 
	{
		speed: 400,
		duration: 2500,
	};
	
	// shows loading gif
	self.loadingOverlay = $("#loading-overlay");
	self.showLoader = function() {
			self.loadingOverlay.css('display','block');                 
	};
	// hides loading gif
	self.hideLoader = function() {
		   self.loadingOverlay.css('display','none'); 
	};
	
	//shows notification
	self.notification = $("#notification");
	self.showPopup = function(message) {
                        self.notification.find('#notification-msg').text(message);
                        self.notification.fadeIn(self.config.speed);
                        setTimeout(function() {self.notification.fadeOut(self.config.speed)},self.config.duration);                  
     };
	 
	 /*self.showTweetModal = function() {
			
			var retweet_modal = $('#retweet-modal');
			var retweet_id = $(this).closest('.tweet').attr('id');
			var tweet = $(this).closest('.tweet').html();
			retweet_modal.children('.modal-body').html(tweet);
			retweet_modal.modal('show');
	 };*/

	return self;
})(ChirpUI || {});