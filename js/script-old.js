// JavaScript Document


//function to show and hide loading animation
	var LoadingAnim = (function(self){
		var loadingOverlay = $("#loading-overlay"); 

		self.show = function(loadingMessage) {
				$('#loading-msg').html(loadingMessage);
				loadingOverlay.css('display','block');
				loadingOverlay.height($(document).height());
				loadingOverlay.width($(document).width());
				loadingOverlay.find('img').css('margin-top',$(window).height()/2);                     
		};

		self.hide = function() {
			   loadingOverlay.css('display','none'); 
		};

		return self;
	})(LoadingAnim || {});
	

LoadingAnim.show("Please wait, getting your timeline"); //show loading animation when user visits the page
	
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

//get handlebars template and compile
var source   = $("#tweet-template").html();
var tweet_template = Handlebars.compile(source);
var tweet_thread = $('.tweet-thread');

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
	LoadingAnim.show("Please wait, Updating status"); //show loading animation
	$.post("get_followers_timeline.php",{username:uname}, function(data) {
			//fill the template with data from the json object
			var tweets = data;
			var html = tweet_template({ data : tweets});
			tweet_thread.html(html);
			LoadingAnim.hide(); // hide animation on success
			
		});
	});				

	// Delete a status from user's timeline
	var retweet = $('.retweet');
	retweet.live('click',function() {
		var current_button = $(this);
		var retweet_id = current_button.closest('.tweet').attr('id');
		if(confirm('Are you sure you want to retweet this tweet ? '+retweet_id))
		{
			$.ajax({
               type: 'POST',
               url: 'tweet_operations.php',
               data: {status_id : retweet_id, action : "retweet"},
				 success: function(data)
				 {
					 if(data=="true")
					 {
						alert('Status retweeted');
						current_button.removeClass('retweet');
						current_button.addClass('retweeted');
						current_button.text('Retweeted');
						current_button.attr('title','Undo Retweet');
					 }
					 else
					 {
						 alert("Some error occured while retweeting. Please try again.");
					}
				 },
	
			   });		
		}
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
						alert('Status retweeted');
						current_button.removeClass('favorite');
						current_button.addClass('favorited');
						current_button.text('favorited');
						current_button.attr('title','Undo Favorite');
					 }
					 else
					 {
						 alert("Some error occured while favoriting tweet. Please try again.");
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
						alert('undo favorite succesfully');
						current_button.removeClass('favorited');
						current_button.addClass('favorite');
						current_button.text('favorite');
						current_button.attr('title','favorite');
					 }
					 else
					 {
						 alert("Some error occured while favoriting tweet. Please try again.");
					}
				 },
	
			   });		
		});	
		
	// Delete a status from user's timeline
	var del_link = $('.delete-tweet');
	del_link.live('click',function() {
		var del_status_id = $(this).closest('.tweet').attr('id');
		if(confirm('Are you sure you want to delete this tweet ? '+del_status_id))
		{
			$.ajax({
               type: 'POST',
               url: 'tweet_operations.php',
               data: {status_id : del_status_id, action : "delete"},
				 success: function(data)
				 {
					 if(data=="true")
					 {
						 LoadingAnim.hide();
						alert('Status deleted');
						$('#'+del_status_id).remove();
					 }
					 else
					 {
						 LoadingAnim.hide();
						 alert("Some error occured while deleting status. Please try again.");
					}
				 },
	
			   });		
		}
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
						 LoadingAnim.hide();
						alert('Status updated');
					 }
					 else
					 {
						 LoadingAnim.hide();
						 alert("Some error occured while updating status. Please try again.");
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