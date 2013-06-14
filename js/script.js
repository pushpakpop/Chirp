$(document).ready(function () {

    //get hashtag from the url when the document is ready
    var currentLocation = window.location.hash.substring(1);

    if (currentLocation === "" || currentLocation === "home") //if home page
    {
        //get users home timeline when page loads
        Chirp.getHomeTimeline();
    } else if (currentLocation === "me") {
        //get the users own tweets
        Chirp.getUserTimeline();
    } else {
        //get the tweets of the username that is present in the URL hashtag
        Chirp.getUserTimeline(currentLocation);
    }

});


// contains event handlers
(function () {

    var statusEl = $('#status'),
        countEl = $('#count span'),
        statusCountEl = $('#status'),
        filterEl = $("#filter"),
        userTweetEl = $(".tweet-user-list li");


    //get users home timeline when clicks on home
    $('#home').click(function () {
        Chirp.getHomeTimeline();
		window.location.hash = "home";
    });


    // current user's tweets
    $('#my-tweets').click(function () {
        Chirp.getUserTimeline();
        window.location.hash = "me";
    });


    //get the followers timeline tweets
    $('.followers').click(function () {
        var uname = $(this).children('p').children('span').text();
        window.location.hash = uname;
        Chirp.getUserTimeline(uname);

    });


    //open modal window when user clicks on retweet link and set retweet id
    $('.delete-tweet').live('click', function () {
        ChirpUI.showDeleteModal($(this));
    });


    // Delete a status from user's timeline
    $('#btn-delete').click(function () {
        setTimeout(function () {
            ChirpUI.deleteModalEl.modal('hide');
        }, 1500);
        Chirp.deleteTweet(ChirpUI.deleteId);

    });


    //open modal window when user clicks on retweet link and set retweet id
    $('.retweet').live('click', function () {
        ChirpUI.showRetweetModal($(this));
    });


    // retweet the tweet when user confirms to retweet from the modal window
    $('#btn-retweet').click(function () {
        setTimeout(function () {
            ChirpUI.retweetModalEl.modal('hide');
        }, 1500);
        Chirp.reTweet(ChirpUI.retweetId);
    });


    //undo retweet of a retweeted status
    $('.retweeted').live('click', function () {
        var unRetweetId = $(this).closest('.tweet').attr('id');
        Chirp.undoRetweet(unRetweetId);
    });


    //farovite a tweet
    $('.favorite').live('click', function () {
        var favoriteId = $(this).closest('.tweet').attr('id');
        Chirp.favoriteTweet(favoriteId);
    });


    // unfavorite a tweet
    $('.favorited').live('click', function () {
        var favoritedId = $(this).closest('.tweet').attr('id');
        Chirp.undoFavorite(favoritedId);
    });


    //post tweets to the current user's timeline
    $("#update-status").click(function () {
        if (statusEl.val() === "") {
            ChirpUI.showPopup(strings.errorBlankStatus);
            statusEl.focus();
            return false;
        }
        if (statusEl.val().length > 140) {
            ChirpUI.showPopup(strings.errorMaxCharacters);
            statusEl.focus();
            return false;
        }
        ChirpUI.showLoader(); //show loading animation
        Chirp.updateStatus(statusEl.val());
    });

    //update remaining characters count as user types
    statusCountEl.on('keyup', function () {
        countEl.text(140 - statusCountEl.val().length);

    });

    //download tweets
    $('#download').click(function () {
        ChirpUI.showLoader(); //show loading animation
        Chirp.downloadTweets();

    });

    //filter followers as the user types in the search box
    filterEl.on("keyup", function () {
        var filter = $(this).val();
        userTweetEl.each(function () {
            if ($(this).text().search(new RegExp(filter, "i")) < 0) {
                $(this).slideUp();
            } else {
                $(this).slideDown();
            }
        });
    });

})();
