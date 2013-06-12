// Main js, contains event handlers n all.



(function(){
	
//get handlebars template and compile



//get users home timeline when page loads
Chirp.getHomeTimeline();


//get users home timeline when clicks on home
var homeTl = $('#home');
homeTl.click(function () {
	Chirp.getHomeTimeline();
	});
	
	
// current user's tweets
var myTweets = $('#my-tweets');
myTweets.click(function(){
	var uname = myTweets.attr('name');
	Chirp.getUserTimeline(uname);
	});
	
	
//get the followers timeline tweets
var followers = $('.followers');
followers.click(function () {
	var uname = this.id;
	Chirp.getUserTimeline(uname);
});		
		

//open modal window when user clicks on retweet link and set retweet id
var deleteLink = $('.delete-tweet');
deleteLink.live('click',function() {
	ChirpUI.showDeleteModal($(this));
	});

	
// Delete a status from user's timeline
var deleteBtn = $('#btn-delete'); // delete button on the delete-modal
deleteBtn.click(function() {
	setTimeout(function(){ChirpUI.deleteModal.modal('hide');},1500);
	console.log(ChirpUI.deleteId);
	Chirp.deleteTweet(ChirpUI.deleteId);
			
});


//open modal window when user clicks on retweet link and set retweet id
var retweetLink = $('.retweet');
retweetLink.live('click',function() {
	ChirpUI.showRetweetModal($(this));
	/*retweetId = $(this).closest('.tweet').attr('id');
	var tweet = $(this).closest('.tweet').html();
	retweetModal.children('.modal-body').html(tweet);
	retweetModal.modal('show');*/
	});
	
	
// retweet the tweet when user confirms to retweet from the modal window
var retweetBtn = $('#btn-retweet');
retweetBtn.click(function() {
	setTimeout(function(){ChirpUI.retweetModal.modal('hide');},1500);
	Chirp.reTweet(ChirpUI.retweetId);
	});


//undo retweet of a retweeted status
var unRetweet = $('.retweeted');
unRetweet.live('click',function() {
	var unRetweetLink = $(this);
	var unRetweetId = unRetweetLink.closest('.tweet').attr('id');
	Chirp.undoRetweet(unRetweetId);
	});	
	
	
//farovite a tweet
var favorite = $('.favorite');
favorite.live('click',function() {
	var currentButton = $(this);
	var favoriteId = currentButton.closest('.tweet').attr('id');
	Chirp.favoriteTweet(favoriteId);
	});
	
	
// unfavorite a tweet
var favorited = $('.favorited');
favorited.live('click',function() {
	var currentButton = $(this);
	var favoritedId = currentButton.closest('.tweet').attr('id');
	Chirp.undoFavorite(favoritedId);	
	});	
		
	
//post tweets to the current user's timeline
var update = $("#update-status");
var status = $('#status');
update.click(function(){
		if(status.val()=="")
		{
			ChirpUI.showPopup("Please provide a status message");
			status.focus();
			return false;
		}
		if(status.val().length > 140)
		{
			ChirpUI.showPopup("A tweet can be of maximum 140 characters only.");
			status.focus();
			return false;
		}
		ChirpUI.showLoader(); //show loading animation
		Chirp.updateStatus(status.val());
	}); 

//update remaining characters count as user types
var count = $('#count span');
var temp = $('#status');
temp.on('keyup',function() {
		var textCount = temp.val().length;
		var remainCount = 140 - textCount;
		count.text(remainCount);
		
	});	
	
//download tweets
var download = $('#download');
download.click(function(){
	ChirpUI.showLoader(); //show loading animation
	Chirp.downloadTweets();
	
	});
	
//filter followers as the user types in the search box
var filter =$("#filter");
filter.on("keyup", function(){
	var filter = $(this).val();
	var temp = $(".tweet-user-list li");
	temp.each(function () {
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



	
	
