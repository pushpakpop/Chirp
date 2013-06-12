// Main js, contains event handlers



(function(){
	
//get users home timeline when page loads
Chirp.getHomeTimeline();


//get users home timeline when clicks on home
$('#home').click(function () {
	Chirp.getHomeTimeline();
	});
	
	
// current user's tweets
$('#my-tweets').click(function(){
	var uname = $(this).attr('name');
	Chirp.getUserTimeline(uname);
	});
	
	
//get the followers timeline tweets
$('.followers').click(function () {
	var uname = this.id;
	Chirp.getUserTimeline(uname);
});		
		

//open modal window when user clicks on retweet link and set retweet id
$('.delete-tweet').live('click',function() {
	ChirpUI.showDeleteModal($(this));
	});

	
// Delete a status from user's timeline
$('#btn-delete').click(function() {
	setTimeout(function(){ChirpUI.deleteModalEl.modal('hide');},1500);
	Chirp.deleteTweet(ChirpUI.deleteId);
			
});


//open modal window when user clicks on retweet link and set retweet id
$('.retweet').live('click',function() {
	ChirpUI.showRetweetModal($(this));
	});
	
	
// retweet the tweet when user confirms to retweet from the modal window
$('#btn-retweet').click(function() {
	setTimeout(function(){ChirpUI.retweetModalEl.modal('hide');},1500);
	Chirp.reTweet(ChirpUI.retweetId);
	});


//undo retweet of a retweeted status
$('.retweeted').live('click',function() {
	var unRetweetLink = $(this);
	var unRetweetId = unRetweetLink.closest('.tweet').attr('id');
	Chirp.undoRetweet(unRetweetId);
	});	
	
	
//farovite a tweet
$('.favorite').live('click',function() {
	var favoriteId = $(this).closest('.tweet').attr('id');
	Chirp.favoriteTweet(favoriteId);
	});
	
	
// unfavorite a tweet
$('.favorited').live('click',function() {
	var currentButtonEl = $(this);
	var favoritedId = currentButtonEl.closest('.tweet').attr('id');
	Chirp.undoFavorite(favoritedId);	
	});	
		
	
//post tweets to the current user's timeline
var statusEl = $('#status');
$("#update-status").click(function(){
		if(statusEl.val()==="")
		{
			ChirpUI.showPopup("Please provide a status message");
			statusEl.focus();
			return false;
		}
		if(statusEl.val().length > 140)
		{
			ChirpUI.showPopup("A tweet can be of maximum 140 characters only.");
			statusEl.focus();
			return false;
		}
		ChirpUI.showLoader(); //show loading animation
		Chirp.updateStatus(statusEl.val());
	}); 

//update remaining characters count as user types
var countEl = $('#count span');
var statusCountEl = $('#status');
statusCountEl.on('keyup',function() {
		countEl.text( 140 - statusCountEl.val().length );
		
	});	
	
//download tweets
$('#download').click(function(){
	ChirpUI.showLoader(); //show loading animation
	Chirp.downloadTweets();
	
	});
	
//filter followers as the user types in the search box
var filterEl =$("#filter");
var userTweetEl = $(".tweet-user-list li");
filterEl.on("keyup", function(){
	var filter = $(this).val();
	userTweetEl.each(function () {
		if ($(this).text().search(new RegExp(filter, "i")) < 0) {
			//$(this).toggleClass("hidden",true);
			$(this).slideUp();
		}else {
			//$(this).toggleClass("hidden",false);
			$(this).slideDown();
		}
	});
});
	
})();



	
	
