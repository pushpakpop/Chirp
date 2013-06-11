// JavaScript Document


//function to show and hide loading animation
var LoadingAnim = (function(self){
	self.loadingOverlay = $("#loading-overlay"); 

	self.show = function(loadingMessage) {
			$('#loading-msg').html(loadingMessage);
			self.loadingOverlay.css('display','block');
			self.loadingOverlay.height($(document).height());
			self.loadingOverlay.width($(document).width());
			self.loadingOverlay.find('img').css('margin-top',$(window).height()/2-50);                     
	};

	self.hide = function() {
		   self.loadingOverlay.css('display','none'); 
	};

	return self;
})(LoadingAnim || {});

//function to show alert message
var popup = (function(self){
        self.config =   {
                                speed: 400,
                                duration: 2500
                        };
 
        self.notification = $("#notification");
 
        self.show = function(message) {
                        self.notification.find('#notification-msg').text(message);
                        self.notification.fadeIn(self.config.speed);
                        setTimeout(function() {self.notification.fadeOut(self.config.speed)},self.config.duration);                  
        };
 
        return self;
})(popup || {});

// convert hash tags, links and usernames clickabel
function parseTwit(str)
{
	var data = str;
	//parse URL
	var str = data.replace(/[A-Za-z]+:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9-_:%&~\?\/.=]+/g,function(s){
		return s.link(s);
	});
	//parse user_name
	str = str.replace(/[@]+[A-Za-z0-9_]+/g,function(s){
		var user_name = s.replace('@','');
		return s.link("http://twitter.com/"+user_name);
	});
	//parse hashtag
	str = str.replace(/[#]+[A-Za-z0-9_]+/g,function(s){
		var hashtag = s.replace('#','');
		return s.link("http://search.twitter.com/search?q="+hashtag);
	});
	return str;
}

// helper function for handlebars
(function (root, factory) {
if (typeof exports === 'object') {
	// Node. Does not work with strict CommonJS, but
	// only CommonJS-like enviroments that support module.exports,
	// like Node.
	module.exports = factory(require('handlebars'));
} else if (typeof define === 'function' && define.amd) {
	// AMD. Register as an anonymous module.
	define(['handlebars'], factory);
} else {
	// Browser globals (root is window)
	root.returnExports = factory(root.Handlebars);
}
}(this, function (Handlebars) {

	//helper function for comaprision
	 Handlebars.registerHelper('if_eq', function(context, options) {
		if (context == options.hash.compare)
			return options.fn(this);
		else
			return options.inverse(this);
	});

	// handlebar helper for showing tweet time using moment.js
	Handlebars.registerHelper('get_date_time', function(created_at) {
		var rtn_date = moment(created_at).fromNow();
		if(rtn_date.indexOf("days") < 0)
			return rtn_date;
		else 
			return moment(created_at).fromNow();
	});

	//handlebar helper for making clickabe links,hashtags,etc
	Handlebars.registerHelper('twityfy', function(text) {
		var chn_text = parseTwit(text);
		return new Handlebars.SafeString( chn_text );
	
	});

}));


//get handlebars template and compile
var source   = $("#tweet-template").html();
var tweet_template = Handlebars.compile(source);
var tweet_thread = $('.tweet-thread');

//function to get hometimeline, user timeline
var Chirp = (function(self){

	self.getHomeTimeline = function() { // the user's home timeline
		
		LoadingAnim.show("Please wait, getting tweets from your home timeline"); //show loading animation when user visits the page
		// get the home timeline
		$.ajax({
			url: "get_tweets.php",
			data: {type : 'home'},
			type: 'POST',
			success: function(data){
				//fill the template with data from the json object
				var tweets = data;
				var html = tweet_template({ data : tweets});
				tweet_thread.html(html);
				LoadingAnim.hide(); // hide animation on success
				
				},
			error: function(){
				LoadingAnim.hide(); // hide animation on success
				 popup.show("Some error occured while getting tweets. Please try again.");
				}
			
			
			});
			                  
	};
	
	self.getUserTimeline = function(name) { //get follower's timeline
		
		$.ajax({
			url: "get_tweets.php",
			data: {username:name,type : 'followers'},
			type: 'POST',
			success: function(data){
				//fill the template with data from the json object
				var tweets = data;
				var html = tweet_template({ data : tweets});
				tweet_thread.html(html);
				$("li a").removeClass("active");
				$('#'+name).addClass('active');
				LoadingAnim.hide(); // hide animation on success
				
				},
			error: function(){
				LoadingAnim.hide(); // hide animation on success
				 popup.show("Some error occured while getting tweets. Please try again.");
				}
			});

	};
	
	self.deleteTweet = function(id) { //delete current user's tweet
	
		$.ajax({
			type: 'POST',
			url: 'tweet_operations.php',
			data: {status_id : id, action : "delete"},
			success: function(data)
			{
				if(data=="true")
				{
					$('#'+delete_id).remove();
					popup.show("Status deleted succesfully");
				}
				else
				{
					popup.show("Some error occured while deleting status. Please try again.");
				}
			},
			error: function()
			{
				popup.show("Some error occured while deleting status. Please try again.");
			}

		   });
	
	};
	
	self.reTweet = function(id) { //retweet a status
	
		$.ajax({
			type: 'POST',
			url: 'tweet_operations.php',
			data: {status_id : id, action : "retweet"},
			success: function(data)
			{
			 if(data =="true")
			 {
				popup.show('Status retweeted');
				var current_tweet = $('#'+id+' .retweet');
				current_tweet.removeClass('retweet');
				current_tweet.addClass('retweeted');
				current_tweet.text('Retweeted');
				current_tweet.attr('title','Undo Retweet');
				current_tweet.attr('name',data);
			 }
			 else
			 {
				 popup.show("Some error occured while retweeting. Please try again.");
			}
			},
			error: function()
			{
				popup.show("Some error occured while retweeting. Please try again.");
			}

	   });	
	   
	};
	
	self.undoRetweet = function(id) { //undo retweet of a status
		
		$.ajax({
		   type: 'POST',
		   url: 'tweet_operations.php',
		   data: {status_id : id, action : "undo_retweet"},
			 success: function(data) {
				 if(data=="true")
				 {
					var currentTweet = $('#'+id+' .retweeted');
					currentTweet.removeClass('retweeted');
					currentTweet.addClass('retweet');
					currentTweet.text('Retweet');
					currentTweet.attr('title','Retweet');
					popup.show("Undo retweet succesfull");
				 }
				 else
					 popup.show("Some error occured while undoing of retweet. Please try again.");
			 },
			error: function() {
				popup.show("Some error occured while undoing of retweet. Please try again.");
			}
		   });	
	};
	
	self.favoriteTweet = function(id) { //favorite a tweet
		
		$.ajax({
		   type: 'POST',
		   url: 'tweet_operations.php',
		   data: {status_id : id, action : "favorite"},
			 success: function(data)
			 {
				 if(data=="true")
				 {
					var currentTweet = $('#'+id+" .favorite");
					popup.show('Status favorited');
					currentTweet.removeClass('favorite');
					currentTweet.addClass('favorited');
					currentTweet.text('favorited');
					currentTweet.attr('title','Undo Favorite');
				 }
				 else
				 {
					 popup.show("Some error occured while favoriting the tweet. Please try again.");
				}
			 },
			 error: function() {
				 popup.show("Some error occured while favoriting the tweet. Please try again.");
			 }

		   });	
	};
	
	self.undoFavorite = function(id) { //unfavorite a tweet
		
		$.ajax({
		   type: 'POST',
		   url: 'tweet_operations.php',
		   data: {status_id : id, action : "unfavorite"},
			 success: function(data)
			 {
				 if(data=="true")
				 {
					var currentTweet = $('#'+id+" .favorited"); 
					popup.show('undo favorite succesfully');
					currentTweet.removeClass('favorited');
					currentTweet.addClass('favorite');
					currentTweet.text('favorite');
					currentTweet.attr('title','favorite');
				 }
				 else
				 {
					 popup.show("Some error occured while favoriting tweet. Please try again.");
				}
			 },
			 error: function() {
				popup.show("Some error occured while favoriting tweet. Please try again.");
			 }
		});
	};
	
	self.updateStatus = function(status) { // update status of the user
		
		LoadingAnim.show("Please wait, Updating status"); //show loading animation
		$.ajax({
			   type: 'POST',
			   url: 'tweet_operations.php',
			   data: {tweet : status, status_id : 1, action : 'update'},
				 success: function(data)
				 {
					 if(data=="true")
					 {
						 // get the home timeline
						 Chirp.getHomeTimeline();
						 
					 }
					 else
					 {
						 LoadingAnim.hide();
						 popup.show("Some error occured while updating status. Please try again.");
					}
				 },
				 error: function() {
					LoadingAnim.hide();
					popup.show("Some error occured while updating status. Please try again.");
				}
	
			 });	
	};
	
	self.downloadTweets = function() { //download tweets
		
		LoadingAnim.show("Please wait, creating pdf file");
		var content = $('.tweet-thread').html();
		$.ajax({
		   type: 'POST',
		   url: 'generate_tweets_pdf.php',
		   data: {'html': content},
			 success: function(data)
			 {
				 if(data=="true")
				 {
					LoadingAnim.hide();//hide the loading proces
					window.location='tweets.pdf'; //down the pdf file
				 }
				 else
				 {
					 LoadingAnim.hide();//hide the loading proces
					 popup.show("Some error occured while creating pdf. Please try again.");
				}
			 },
			 error: function() {
				LoadingAnim.hide();//hide the loading proces
				popup.show("Some error occured while creating pdf. Please try again.");
			 }	

		   });
	}
	
	
	return self;
})(Chirp || {});
	

//get users home timeline when page loads
Chirp.getHomeTimeline();


//get users home timeline when clicks on home
var homeTl = $('#home');
homeTl.click(function () {
	Chirp.getHomeTimeline();
	});
	
	
// current user's tweets
var myTweets = $('#my_tweets');
myTweets.click(function(){
	var uname = myTweets.attr('name');
	LoadingAnim.show("Please wait, loading tweets from your timeline"); //show loading animation
	Chirp.getUserTimeline(uname);
	});
	
	
//get the followers timeline tweets
var followers = $('.followers');
followers.click(function () {
	var uname = this.id;
	LoadingAnim.show("Please wait, loading tweets from "+uname+"'s timeline"); //show loading animation
	Chirp.getUserTimeline(uname);
});		
		

//open modal window when user clicks on retweet link and set retweet id
var delete_modal = $('#delete-modal');
var delete_link = $('.delete-tweet');
var delete_id; //to hold the tweet id to be deleted
delete_link.live('click',function() {
	var tweetId = $(this);
	delete_id = tweetId.closest('.tweet').attr('id');
	var tweet = tweetId.closest('.tweet').html();
	delete_modal.children('.modal-body').html(tweet);
	delete_modal.modal('show');
	});
	
	
// Delete a status from user's timeline
var del_button = $('.btn-delete'); // delete button on the delete-modal
del_button.click(function() {
	setTimeout(function(){delete_modal.modal('hide');},1500);
	Chirp.deleteTweet(delete_id);
			
});


//open modal window when user clicks on retweet link and set retweet id
var retweet_modal = $('#retweet-modal');
var retweet_link = $('.retweet');
var retweet_id; //to hold the tweet id to be retweeted
retweet_link.live('click',function() {
	retweet_id = $(this).closest('.tweet').attr('id');
	var tweet = $(this).closest('.tweet').html();
	retweet_modal.children('.modal-body').html(tweet);
	retweet_modal.modal('show');
	});
	
	
// retweet the tweet when user confirms to retweet from the modal window
var retweet_btn = $('.btn-retweet');
retweet_btn.click(function() {
	setTimeout(function(){retweet_modal.modal('hide');},1500);
	Chirp.reTweet(retweet_id);
	});


//undo retweet of a retweeted status
var unretweet = $('.retweeted');
unretweet.live('click',function() {
	var unretweet_link = $(this);
	var unretweet_id = unretweet_link.closest('.tweet').attr('id');
	Chirp.undoRetweet(unretweet_id);
	});	
	
	
//farovite a tweet
var favorite = $('.favorite');
favorite.live('click',function() {
	var current_button = $(this);
	var favorite_id = current_button.closest('.tweet').attr('id');
	Chirp.favoriteTweet(favorite_id);
	});
	
	
// unfavorite a tweet
var favorited = $('.favorited');
favorited.live('click',function() {
	var current_button = $(this);
	var favorited_id = current_button.closest('.tweet').attr('id');
	Chirp.undoFavorite(favorited_id);	
	});	
		
	
//post tweets to the current user's timeline
var update = $("#update-status");
update.click(function(){
		var status = document.getElementById('status');
		if(status.value=="")
		{
			alert("Please provide a status message");
			status.focus();
			return false;
		}
		Chirp.updateStatus(status.value);
	}); 
	
	
//filter followers as the user types in the search box
var filter =$("#filter");
filter.on("keyup", function(){
	var filter = $(this).val();
	var temp = $(".tweet-user-list li");
	temp.each(function () {
		if ($(this).text().search(new RegExp(filter, "i")) < 0) {
			$(this).toggleClass("hidden",true);
		}else {
			$(this).toggleClass("hidden",false);
		}
	});
});
	
	
//download tweets
var download = $('#download');
download.click(function(){
	//show loading process
	Chirp.downloadTweets();
	
	});
	
