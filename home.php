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
<link rel="stylesheet" type="text/css" href="http://fonts.googleapis.com/css?family=Open+Sans">
<link rel="stylesheet" href="css/style.css">
<link rel="stylesheet" href="css/modal.css">
<link rel="icon" type="image/png" href="images/Chirp.png" />
</head>

<body>
<!--//-->
	<div id="wrapper">
    	<!--<div id="logo">
        	<h1 title="chirp"><a href="home.php"><img src="images/Chirp.png" alt="Logo"><span>Chirp</span></a></h1>
        </div>-->
			<div class="tweet-container">
				<div class="tweet-north">
                	<div class="user-details">
                    	<div id="chirp-user">
                        	
                                <span class="user-img"><img src="<?php echo $user_info->profile_image_url?>" width="40" height="40" alt="profile image"></span>
                                <span class="user-title"><?php echo $user_info->name?></span>
                                <p class="user-desc"><a href="javascript:void(0)" id="home">Home</a><a href="javascript:void(0)" id="my-tweets">My Tweets</a><a href="clearsession.php" id="logout">Logout</a></p>
                            
                        </div>
                        <div class="search-follower">
                            <input type="text" placeholder="Search followers" id="filter">
                        </div><!--//.search-follower-->
                        <ul class="tweet-user-list">
                        <?php 
							if($friend_list->users)
							{
								foreach ($friend_list->users as $friends) { ?>
								<li>
									<a href="javascript:void(0)" id="<?php echo $friends->screen_name?>" class="followers" >
										<span class="user-img"><img src="<?php echo $friends->profile_image_url?>" alt="profile image" width="40" height="40"></span>
										<span class="user-title"><?php echo $friends->name?></span>
										<p class="user-desc">@<?php echo $friends->screen_name?></p>
									</a>
								</li>
                        <?php }
							} ?>
                            
                        </ul>
                    </div><!--//.user-details-->
					<div class="tweet-thread">
                    
                    	<div id="loading-overlay">
                            <img src="images/loading.gif" alt='loading'>
                        </div><!--//#loading-overlay-->
                     
                     <div id="tweets" >
						 <script id="tweet-template" type="text/x-handlebars-template">
                         {{#if this}}
                            {{#data}}
                                 <div class="tweet bubble-left" id="{{id_str}}">
                                        <img src="{{user.profile_image_url}}" alt="profile image" >
                                    <label class='tweet-user' id="">{{user.name}} <span><a href='www.twitter.com/{{user.screen_name}}' target="_blank">@{{user.screen_name}}</a></span></label>
                                    <label class="tweet-timestamp" id="">{{getDateTime created_at}}</label>
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
                                 </div> <!--//.tweet-->
                            {{/data}}
                        {{else}}
                            <div> No Tweets yet</div>
                        {{/if}}
                         </script>
                   	</div><!--//#tweets-->
                     
					</div><!--//.tweet-thread-->
				</div><!--//.tweet-north-->
                
				<div class="tweet-south" >
					<textarea cols="20" rows="1" id="status" placeholder="Tweet something..... max 140 characters" maxlength="140" ></textarea>
					<button id="update-status"><img src="images/tweet.png" alt="tweet">Tweet</button>
                    <button id="download" title="download current tweets"><img src="images/download.png" alt="download">Download</button>
                    <p id="count"><span>140</span></p>
				</div><!--//.tweet-south-->
                
			</div><!--//.tweet-container-->
	</div><!--//#wrapper-->

<!--modal for retweeting-->
<div id="retweet-modal" class="modal hidden fade" data-backdrop="static">
	<div class="modal-header">
    	<h3 class="modal-title">Retweet this to your follolwers?</h3>
    </div><!--//.modal-header-->
    <div class="modal-body">
    	
    </div><!--//.modal-body-->
    <div class="modal-footer">
        <button type="button" id="btn-retweet">Retweet</button>
        <button type="button" data-dismiss="modal" class="cancel">Cancel</button>
    </div><!--//.modal-footer-->
</div><!--//#retweet-modal-->

<!--modal for retweeting-->
<div id="delete-modal" class="modal hidden fade" data-backdrop="static">
	<div class="modal-header">
    	<h3 class="modal-title">Are you sure you want to delete this tweet?</h3>
    </div><!--//.modal-header-->
    <div class="modal-body">
    	
    </div><!--//.modal-body-->
    <div class="modal-footer">
        <button type="button" id="btn-delete">Delete</button>
        <button type="button" data-dismiss="modal" class="cancel">Cancel</button>
    </div><!--//.modal-footer-->
</div><!--//#delete-modal-->

<div id="notification">
	<div id="notification-msg"></div>
</div><!--//.notification-->

<script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.1/jquery.min.js"></script>
<script>window.jQuery || document.write('<script src="lib/bootstrap/js/jquery-1.8.1.min.js"><\/script>')</script>
<script type="text/javascript" src="lib/handlebars.js"></script>
<script type="text/javascript" src="lib/moment.js"></script>
<script type="text/javascript" src="lib/bootstrap-modal.js"></script>
<script type="text/javascript" src="js/handlebar-helper.js"></script>
<script type="text/javascript" src="js/Chirp.js"></script>
<script type="text/javascript" src="js/ChirpUI.js"></script>     
<script type="text/javascript" src="js/script.js"></script>        
</body>
</html>
