//Chirp class. contains methods related to tweet 
var Chirp = (function(self){

	self.getHomeTimeline = function() { // the user's home timeline
		
		// get the home timeline
		$.ajax({
			url: "get_tweets.php",
			data: {type : 'home'},
			type: 'POST',
			success: function(data){
				//fill the template with data from the json object
				var tweets = data;
				var html = tweetTemplate({ data : tweets});
				tweetThread.html(html);
				$('.tweet a').attr('target','_blank');          
				$("li a").removeClass("active");
				ChirpUI.hideLoader(); // hide animation on success
				
				},
			error: function(){
				ChirpUI.hideLoader(); // hide animation on success
				ChirpUI.showPopup("Some error occured while getting tweets. Please try again.");
				},
			beforeSend: function() {
				ChirpUI.showLoader(); // hide animation on success
			}
			
			});
			        
	};
	
	self.getUserTimeline = function(name) { //get follower's timeline
		
		$.ajax({
			url: "get_tweets.php",
			data: {userName:name,type : 'followers'},
			type: 'POST',
			success: function(data){
				//fill the template with data from the json object
				var tweets = data;
				var html = tweetTemplate({ data : tweets});
				tweetThread.html(html);
				$("li a").removeClass("active");
				$('#'+name).addClass('active');
				ChirpUI.hideLoader(); // hide animation on success
				},
			error: function(){
				ChirpUI.hideLoader(); // hide animation on success
				 ChirpUI.showPopup("Some error occured while getting tweets. Please try again.");
				},
			beforeSend: function() {
				ChirpUI.showLoader(); // hide animation on success
			}
			
			});

	};
	
	self.deleteTweet = function(id) { //delete current user's tweet
	
		$.ajax({
			type: 'POST',
			url: 'tweet_operations.php',
			data: {statusId : id, action : "delete"},
			success: function(data)
			{
				if(data=="true")
				{
					$('#'+delete_id).remove();
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
	
	self.reTweet = function(id) { //retweet a status
	
		$.ajax({
			type: 'POST',
			url: 'tweet_operations.php',
			data: {statusId : id, action : "retweet"},
			success: function(data)
			{
			 if(data =="true")
			 {
				ChirpUI.showPopup('Status retweeted');
				var currentTweet = $('#'+id+' .retweet');
				currentTweet.removeClass('retweet');
				currentTweet.addClass('retweeted');
				currentTweet.text('Retweeted');
				currentTweet.attr('title','Undo Retweet');
				currentTweet.attr('name',data);
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
	
	self.undoRetweet = function(id) { //undo retweet of a status
		
		$.ajax({
		   type: 'POST',
		   url: 'tweet_operations.php',
		   data: {statusId : id, action : "undo_retweet"},
			 success: function(data) {
				 if(data=="true")
				 {
					var currentTweet = $('#'+id+' .retweeted');
					currentTweet.removeClass('retweeted');
					currentTweet.addClass('retweet');
					currentTweet.text('Retweet');
					currentTweet.attr('title','Retweet');
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
	
	self.favoriteTweet = function(id) { //favorite a tweet
		
		$.ajax({
		   type: 'POST',
		   url: 'tweet_operations.php',
		   data: {statusId : id, action : "favorite"},
			 success: function(data)
			 {
				 if(data=="true")
				 {
					var currentTweet = $('#'+id+" .favorite");
					ChirpUI.showPopup('Status favorited');
					currentTweet.removeClass('favorite');
					currentTweet.addClass('favorited');
					currentTweet.text('favorited');
					currentTweet.attr('title','Undo Favorite');
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
	
	self.undoFavorite = function(id) { //unfavorite a tweet
		
		$.ajax({
		   type: 'POST',
		   url: 'tweet_operations.php',
		   data: {statusId : id, action : "unfavorite"},
			 success: function(data)
			 {
				 if(data=="true")
				 {
					var currentTweet = $('#'+id+" .favorited"); 
					ChirpUI.showPopup('undo favorite succesfully');
					currentTweet.removeClass('favorited');
					currentTweet.addClass('favorite');
					currentTweet.text('favorite');
					currentTweet.attr('title','favorite');
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
	
	self.updateStatus = function(status) { // update status of the user
		
		$.ajax({
			   type: 'POST',
			   url: 'tweet_operations.php',
			   data: {tweet : status, statusId : 1, action : 'update'},
				 success: function(data)
				 {
					 if(data=="true")
					 {
						 // get the home timeline
						 Chirp.getHomeTimeline();
						 
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
	
	self.downloadTweets = function() { //download tweets
		
		var content = $('#tweets').html();
		$.ajax({
		   type: 'POST',
		   url: 'generate_tweets_pdf.php',
		   data: {'html': content},
			 success: function(data)
			 {
				 if(data=="true")
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
	
	// convert hash tags, links and usernames clickabel
	self.parseTwit = function(str) {
			
			var data = str;
			//parse URL
			var str = data.replace(/[A-Za-z]+:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9-_:%&~\?\/.=]+/g,function(s){
				return s.link(s);
			});
			//parse user_name
			str = str.replace(/[@]+[A-Za-z0-9_]+/g,function(s){
				var userName = s.replace('@','');
				return s.link("http://twitter.com/"+userName);
			});
			//parse hashtag
			str = str.replace(/[#]+[A-Za-z0-9_]+/g,function(s){
				var hashTag = s.replace('#','');
				return s.link("http://search.twitter.com/search?q="+hashTag);
			});
			return str;
		}
	
	return self;
})(Chirp || {});