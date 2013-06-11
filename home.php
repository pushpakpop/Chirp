<?php
session_start();
require_once('lib/twitteroauth/twitteroauth.php');
require_once('config.php');

// tf access tokens are not available,clear session and redirect to login page.
if (empty($_SESSION['access_token']) || empty($_SESSION['access_token']['oauth_token']) || empty($_SESSION['access_token']['oauth_token_secret']))
{
    header('Location: clearsession.php');
}
// get user access tokens from the session.
$access_token = $_SESSION['access_token'];

// create a TwitterOauth object with tokens.
$twitteroauth = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET, $access_token['oauth_token'], $access_token['oauth_token_secret']);

// get the current user's info
$user_info = $twitteroauth->get('account/verify_credentials');

//get the followers list
$friend_list = $twitteroauth->get("https://api.twitter.com/1.1/followers/list.json?cursor=-1&screen_name=".$user_info->screen_name."&skip_status=true&include_user_entities=false&count=30");
?>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Chirp</title>
<link rel="stylesheet" href="css/modal.css">
<link rel="stylesheet" href="css/style.css">
<link rel="icon" type="image/png" href="images/Chirp.png" />
</head>

<body>

	<div id="wrapper">
			<div class="tweet-container">
				<div class="tweet-north">
                	<div class="user-details">
                    	<!--<div id="chir-user">
                        	
                                <span class="user-img"><img src="<?php echo $user_info->profile_image_url?>" width="40" height="40" alt="profile image"></span>
                                <span class="user-title"><?php echo $user_info->name?></span>
                                <p class="user-desc"><a href="#">Home</a><a href="#">Me</a><a href="#">Logout</a></p>
                            
                        </div>-->
                        <ul class="tweet-user-list">
                        <li>
                        	<a href="javascript:void(0)" class="chirp-user">
                        	<span class="user-img"><img src="<?php echo $user_info->profile_image_url?>" width="40" height="40" alt="profile image"></span>
                            <span class="user-title"><?php echo $user_info->name?></span>
                            <p class="user-desc"><label id="home">Home</label><label id="my_tweets" name="<?php echo $user_info->screen_name?>">My Tweets</label><label id="logout">logout</label></p>
                            </a>
                        </li>
                        <?php foreach ($friend_list->users as $friends) { ?>
                            <li>
                                <a href="javascript:void(0)" id="<?php echo $friends->screen_name?>" class="followers" >
                                    <span class="user-img"><img src="<?php echo $friends->profile_image_url?>" alt="profile image" width="40" height="40"></span>
                                    <span class="user-title"><?php echo $friends->name?></span>
                                    <p class="user-desc">@<?php echo $friends->screen_name?></p>
                                </a>
                            </li>
                        <?php } ?>
                            
                        </ul>
                       	<div class="search-follower">
                            <input type="text" placeholder="Search followers" id="filter">
                        </div>
                    </div>
					<div class="tweet-thread">
                     
                     <script id="tweet-template" type="text/x-handlebars-template">
					 {{#if this}}
                    	{{#data}}
							 <div class="tweet bubble-left" id="{{id_str}}">
							 		<img src="{{user.profile_image_url}}" alt="profile image" >
								<label class='tweet-user' id="">{{user.name}} <span><a href='www.twitter.com/{{user.screen_name}}' target="_lank">@{{user.screen_name}}</a></span></label>
								<label class="tweet-timestamp" id="">{{get_date_time created_at}}</label>
								<p class="tweet-text">{{twityfy text}}</p>
								<p class="links">
								{{#if_eq user.screen_name compare="<?php echo $user_info->screen_name?>"}}
									<a href="javascript:void(0)" class="delete-tweet" title="Delete this tweet">Delete</a>
								{{else}}
									{{#if retweeted}}
										<a href="javascript:void(0)" class="retweeted" name="{{id_str}}" title="Undo retweet">Retweeted</a>
									{{else}}
										<a href="javascript:void(0)" class="retweet" title="Retweet">Retweet</a>
									{{/if}}
								{{/if_eq}}
								
								{{#if favorited}}
									<a href="javascript:void(0)" class="favorited" title="Undo favorite">Favorited</a>
								{{else}}
									<a href="javascript:void(0)" class="favorite" title="Favorite">Favorite</a>
								{{/if}}
								</p>
							 </div>
						{{/data}}
                	{{else}}
						<div> No Tweets yet</div>
					{{/if}}
					 </script>
                     
					</div>
				</div>
                
				<div class="tweet-south">
					<textarea cols="20" rows="1" id="status" placeholder="update your status on twitter"></textarea>
					<button id="update-status">Update</button>
                    <button id="download" title="download current tweets">Download</button>
				</div>
			</div>
		</div>

<!--modal for retweeting-->
<div id="retweet-modal" class="modal hidden fade" data-backdrop="static" >
	<div class="modal-header">
    	<h3 id="myModalLabel" class="modal-title">Retweet this to your follolwers?</h3>
    </div>
    <div class="modal-body">
    	
    </div>
    <div class="modal-footer">
        <button type="button" data-dismiss="modal" class="btn">Cancel</button>
        <button type="button" class="btn btn-primary btn-retweet">Retweet</button>
    </div>
</div>

<!--modal for retweeting-->
<div id="delete-modal" class="modal hidden fade" data-backdrop="static">
	<div class="modal-header">
    	<h3 id="myModalLabel" class="modal-title">Are you sure you want to delete this tweet?</h3>
    </div>
    <div class="modal-body">
    	
    </div>
    <div class="modal-footer">
        <button type="button" data-dismiss="modal" class="btn">Cancel</button>
        <button type="button" class="btn btn-primary btn-delete">Delete</button>
    </div>
</div>
        
<div id="loading-overlay">
	<img src="images/loading.gif" alt='loading'>
    <p id="loading-msg"></p>
</div>
<div id="notification">
	<div id="notification-msg">hi there</div>
</div>
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.1/jquery.min.js"></script>
<script>window.jQuery || document.write('<script src="lib/bootstrap/js/jquery-1.8.1.min.js"><\/script>')</script>
<script type="text/javascript" src="lib/handlebars.js"></script>
<script type="text/javascript" src="lib/moment.js"></script>
<script type="text/javascript" src="lib/bootstrap-modal.js"></script>
<script type="text/javascript" src="js/script.js"></script>        
</body>
</html>
