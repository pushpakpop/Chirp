/**
 * Chirp v1.0. Tweets related features
 * 
 * @author Pushpak Patel <https://github.com/pushpakpop>
 * License: GPLv3
 * 
 */
var Chirp = (function(self) {
	
	self.tweetTemplate = Handlebars.compile($("#tweet-template").html());
	self.tweetThread = $('#tweets');
	/**
	 * Retrives the Home Timeline of the authenticated user.
	 */
	self.getHomeTimeline = function() { 
		$.ajax({
				url: "get_tweets.php",
				data: {type : 'home'},
				type: 'POST',
				success: function(data){
					//fill the template with data from the json object
					ChirpUI.loadTweets(data);          
					$("li a").removeClass("active");
					ChirpUI.hideLoader(); // hide animation on success
					
					},
				error: function() {
					ChirpUI.hideLoader(); // hide animation on success
					ChirpUI.showPopup("Some error occured while getting tweets. Please try again.");
					},
				beforeSend: function() {
					ChirpUI.showLoader(); // hide animation on success
				}
			});
	};
	
	/**
	 * Retrives the User Timeline of the specified/authenticated user.
	 * @param name of the user
	 */
	self.getUserTimeline = function(name) { 
		$.ajax({
				url: "get_tweets.php",
				data: {userName:name,type : 'followers'},
				type: 'POST',
				success: function(data) {
					
					if(data=="unauthorized") 
					{
						ChirpUI.hideLoader(); // hide animation and show message if user is not authorized to view the required timeline
					 	ChirpUI.showPopup("Not authorized to view this user's timeline");
					}
					else
					{
					//fill the template with data from the json object
					ChirpUI.loadTweets(data);
					$("li a").removeClass("active");
					$('#'+name).addClass('active');
					ChirpUI.hideLoader(); // hide animation on success
					}
					
					},
				error: function (){
					ChirpUI.hideLoader(); // hide animation on success
					 ChirpUI.showPopup("Some error occured while getting tweets. Please try again.");
					},
				beforeSend: function() {
					ChirpUI.showLoader(); // hide animation on success
					
				}
			});
	};
	
	/**
	 * Deletes the authenticated user's specified tweet.
	 * @param id of the tweet to be deleted
	 */
	self.deleteTweet = function(id) {
		$.ajax({
				type: 'POST',
				url: 'tweet_operations.php',
				data: {statusId : id, action : "delete"},
				success: function(data)
				{
					if(data.status)
					{
						$('#'+id).remove();
						ChirpUI.showPopup("Status deleted succesfully");
					}
					else
					{
						ChirpUI.showPopup("Some error occured while deleting status. Please try again.");
					}
				},
				error: function()
				{
					ChirpUI.showPopup("Some error occured while deleting status. Please try again.");
				}
			   });
	};
	
	/**
	 * Retweets the specified tweet.
	 * @param id of the tweet to be retweeted
	 */
	self.reTweet = function(id) { 
		$.ajax({
			type: 'POST',
			url: 'tweet_operations.php',
			data: {statusId : id, action : "retweet"},
			success: function(data)
			{
			 if(data.status)
			 {
				ChirpUI.showPopup('Status retweeted');
				ChirpUI.swapRetweetLink('retweet',id);
			 }
			 else
			 {
				 ChirpUI.showPopup("Some error occured while retweeting. Please try again.");
			}
			},
			error: function()
			{
				ChirpUI.showPopup("Some error occured while retweeting. Please try again.");
			}
	   });	
	};
	
	/**
	 * Deletes the retweet of the specific tweet done by the authenticated user.
	 * @param id of the retweet to be undone/delete
	 */
	self.undoRetweet = function(id) { 
		$.ajax({
		   type: 'POST',
		   url: 'tweet_operations.php',
		   data: {statusId : id, action : "undo_retweet"},
			 success: function(data) {
				 if(data.status)
				 {
					ChirpUI.swapRetweetLink('retweeted',id);
					ChirpUI.showPopup("Undo retweet succesfull");
				 }
				 else
					 ChirpUI.showPopup("Some error occured while undoing of retweet. Please try again.");
			 },
			error: function() {
				ChirpUI.showPopup("Some error occured while undoing of retweet. Please try again.");
			}
		   });	
	};
	
	/**
	 * Favorites the specified tweet
	 * @param id of the tweet to be favorited
	 */
	self.favoriteTweet = function(id) { 
		$.ajax({
		   type: 'POST',
		   url: 'tweet_operations.php',
		   data: {statusId : id, action : "favorite"},
			 success: function(data)
			 {
				 if(data.status)
				 {
					
					ChirpUI.showPopup('Status favorited');
					ChirpUI.swapFavoriteLink('favorite',id);
				 }
				 else
				 {
					 ChirpUI.showPopup("Some error occured while favoriting the tweet. Please try again.");
				}
			 },
			 error: function() {
				 ChirpUI.showPopup("Some error occured while favoriting the tweet. Please try again.");
			 }
		   });	
	};
	
	/**
	 * Undo favorites specified tweet.
	 * @param id of the tweet to be unfavorited
	 */
	self.undoFavorite = function(id) {
		$.ajax({
		   type: 'POST',
		   url: 'tweet_operations.php',
		   data: {statusId : id, action : "unfavorite"},
			 success: function(data)
			 {
				 if(data.status)
				 {
					ChirpUI.showPopup('undo favorite succesfully');
					ChirpUI.swapFavoriteLink('favorited',id);
				 }
				 else
				 {
					 ChirpUI.showPopup("Some error occured while favoriting tweet. Please try again.");
				}
			 },
			 error: function() {
				ChirpUI.showPopup("Some error occured while favoriting tweet. Please try again.");
			 }
		});
	};
	
	/**
	 * Updates the status of the authenticated user.
	 * @param status/tweet of the updated
	 */
	self.updateStatus = function(status) {
		$.ajax({
			   type: 'POST',
			   url: 'tweet_operations.php',
			   data: {tweet : status, statusId : 1, action : 'update'},
				 success: function(data)
				 {
					 if(data.status)
					 {
						 // get the home timeline
						 Chirp.getHomeTimeline();
						 $('#status').val(''); //empty the tweet text from textarea
					 }
					 else
					 {
						 ChirpUI.hideLoader();
						 ChirpUI.showPopup("Some error occured while updating status. Please try again.");
					}
				 },
				 error: function() {
					ChirpUI.hideLoader();
					ChirpUI.showPopup("Some error occured while updating status. Please try again.");
					},
				beforeSend: function() {
					ChirpUI.showLoader(); // hide animation on success
					}
			 });	
	};
	
	/**
	 * Generates a pdf file with the current tweets visible and prompts the user to download
	 * 
	 */
	self.downloadTweets = function() {
		var content = $('#tweets').html();
		$.ajax({
		   type: 'POST',
		   url: 'generate_tweets_pdf.php',
		   data: {'html': content},
			 success: function(data)
			 {
				 if(data.status)
				 {
					ChirpUI.hideLoader();//hide the loading proces
					window.location='tweets.pdf'; //down the pdf file
				 }
				 else
				 {
					 ChirpUI.hideLoader();//hide the loading proces
					 ChirpUI.showPopup("Some error occured while creating pdf. Please try again.");
				}
			 },
			 error: function() {
				ChirpUI.hideLoader();//hide the loading proces
				ChirpUI.showPopup("Some error occured while creating pdf. Please try again.");
			 	},
			 beforeSend: function() {
				ChirpUI.showLoader(); // hide animation on success
				}
		   });
	}
	
	/**
	 * Converts text link,hashtags, and usernames to links
	 * @param tweet text
	 * returns the converted tweet
	 */
	self.parseTweet = function(str) {
			var data = str;
			//parse URL
			var str = data.replace(/[A-Za-z]+:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9-_:%&~\?\/.=]+/g,function(s) {
				return s.link(s);
			});
			//parse user_name
			str = str.replace(/[@]+[A-Za-z0-9_]+/g,function(s) {
				var userName = s.replace('@','');
				return s.link("http://twitter.com/"+userName);
			});
			//parse hashtag
			str = str.replace(/[#]+[A-Za-z0-9_]+/g,function(s) {
				var hashTag = s.replace('#','');
				return s.link("http://twitter.com/search?q="+hashTag);
			});
			return str;
		}
	
	return self;
})(Chirp || {});