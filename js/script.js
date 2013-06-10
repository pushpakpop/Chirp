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

var popup = (function(self){
        self.config =   {
                                speed: 400,
                                duration: 2000
                        };
 
        self.notification = $("#notification");
 
        self.show = function(message) {
                        self.notification.find('#notification-msg').text(message);
                        self.notification.fadeIn(self.config.speed);
                        setTimeout(function() {self.notification.fadeOut(self.config.speed)},self.config.duration);                  
        };
 
        return self;
})(popup || {});


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

 Handlebars.registerHelper('if_eq', function(context, options) {
				if (context == options.hash.compare)
					return options.fn(this);
				return options.inverse(this);
			});

}));

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

//get handlebars template and compile
var source   = $("#tweet-template").html();
var tweet_template = Handlebars.compile(source);
var tweet_thread = $('.tweet-thread');

LoadingAnim.show("Please wait, getting your tweets from your home timeline"); //show loading animation when user visits the page
// get the home timeline
$.post("get_home_timeline.php",function(data) {
		//fill the template with data from the json object
		var tweets = data;
		var html = tweet_template({ data : tweets});
		tweet_thread.html(html);
		LoadingAnim.hide(); // hide animation on success
		
	});
	
	
//get the followers timeline tweets
var followers = $('.followers');
followers.click(function () {
var uname = this.id;
LoadingAnim.show("Please wait, loading tweets from "+uname+"'s timeline"); //show loading animation
$.post("get_followers_timeline.php",{username:uname}, function(data) {
		//fill the template with data from the json object
		var tweets = data;
		var html = tweet_template({ data : tweets});
		tweet_thread.html(html);
		$("li a").removeClass("active");
		$('#'+uname).addClass('active');
		LoadingAnim.hide(); // hide animation on success
		
	});
});				

//open modal window when user clicks on retweet link and set retweet id
var delete_modal = $('#delete-modal');
var delete_link = $('.delete-tweet');
var delete_id; //to hold the tweet id to be deleted
delete_link.live('click',function() {
	var tweet = $(this);
	delete_id = tweet.closest('.tweet').attr('id');
	var tweet = tweet.closest('.tweet').html();
	delete_modal.children('.modal-body').html(tweet);
	delete_modal.modal('show');
	});
	
	
// Delete a status from user's timeline
var del_button = $('.btn-delete'); // delete button on the delete-modal
del_button.click(function() {
	delete_modal.modal('hide');
	$.ajax({
		   type: 'POST',
		   url: 'tweet_operations.php',
		   data: {status_id : delete_id, action : "delete"},
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

		   });		
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
	retweet_modal.modal('hide');
	var current_tweet = $('#'+retweet_id+' .retweet');
		$.ajax({
		   type: 'POST',
		   url: 'tweet_operations.php',
		   data: {status_id : retweet_id, action : "retweet"},
			 success: function(data)
			 {
				 if(data=="true")
				 {
					popup.show('Status retweeted');
					current_tweet.removeClass('retweet');
					current_tweet.addClass('retweeted');
					current_tweet.text('Retweeted');
					current_tweet.attr('title','Undo Retweet');

				 }
				 else
				 {
					 popup.show("Some error occured while retweeting. Please try again.");
				}
			 },

		   });		
	});


//undo retweet of a retweeted status
var unretweet = $('.retweeted');
unretweet.live('click',function() {
	var retweet_link = $(this);
	var unretweet_id = retweet_link.attr('name');
		$.ajax({
		   type: 'POST',
		   url: 'tweet_operations.php',
		   data: {status_id : unretweet_id, action : "undo_retweet"},
			 success: function(data)
			 {
				 if(data=="true")
				 {
					retweet_link.removeClass('retweeted');
					retweet_link.addClass('retweet');
					retweet_link.text('Retweet');
					retweet_link.attr('title','Retweet');
					popup.show("Undo retweet succesfull");
				 }
				 else
				 {
					 popup.show("Some error occured while undoing of retweet. Please try again.");
				}
			 },

		   });		
	});	
	
//farovite a tweet
var favorite = $('.favorite');
favorite.live('click',function() {
	var current_button = $(this);
	var favorite_id = current_button.closest('.tweet').attr('id');
		$.ajax({
		   type: 'POST',
		   url: 'tweet_operations.php',
		   data: {status_id : favorite_id, action : "favorite"},
			 success: function(data)
			 {
				 if(data=="true")
				 {
					popup.show('Status favorited');
					current_button.removeClass('favorite');
					current_button.addClass('favorited');
					current_button.text('favorited');
					current_button.attr('title','Undo Favorite');
				 }
				 else
				 {
					 popup.show("Some error occured while favoriting tweet. Please try again.");
				}
			 },

		   });		
	});
	
	
// unfavorite a tweet
var favorited = $('.favorited');
favorited.live('click',function() {
	var current_button = $(this);
	var favorited_id = current_button.closest('.tweet').attr('id');
		$.ajax({
		   type: 'POST',
		   url: 'tweet_operations.php',
		   data: {status_id : favorited_id, action : "unfavorite"},
			 success: function(data)
			 {
				 if(data=="true")
				 {
					popup.show('undo favorite succesfully');
					current_button.removeClass('favorited');
					current_button.addClass('favorite');
					current_button.text('favorite');
					current_button.attr('title','favorite');
				 }
				 else
				 {
					 popup.show("Some error occured while favoriting tweet. Please try again.");
				}
			 },

		   });		
	});	
		
	
//post tweets to the current user's timeline
function postTweet()
{
	var status = document.getElementById('status').value;
	if(status=="")
	{
		alert("Please provide a status message");
		return false;
	}
	
	LoadingAnim.show("Please wait, Updating status"); //show loading animation
	$.ajax({
		   type: 'POST',
		   url: 'update_status.php',
		   data: {tweet : status},
			 success: function(data)
			 {
				 if(data=="true")
				 {
					 // get the home timeline
					$.post("get_home_timeline.php",function(data) {
							//fill the template with data from the json object
							var tweets = data;
							var html = tweet_template({ data : tweets});
							tweet_thread.html(html);
							$("li a").removeClass("active");
							$('#status').val('');
							LoadingAnim.hide(); // hide animation on success
							popup.show('Status updated succesfully');
							
						});
				 }
				 else
				 {
					 LoadingAnim.hide();
					 popup.show("Some error occured while updating status. Please try again.");
				}
			 },

		   });	
}
	
	
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
	
	
//download tweets
var download = $('#download');
download.click(function(){
	var uname = this.id;
	//show loading process
	LoadingAnim.show("Please wait, creating pdf file");
	var content = $('.tweet-thread').html();
	$.ajax({
		   type: 'POST',
		   url: 'generate_tweets_pdf.php',
		   data: {'html': content},
			 success: function(data)
			 {
				
				//hide the loading proces
				LoadingAnim.hide();
				
				//down the pdf file
				self.location='tweets.pdf'
			 },

		   });
	
	});
	
