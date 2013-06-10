<?php 
// this file gets the followers and tweets from the limeline of the requested tweeter user
session_start();
require_once('lib/twitteroauth/twitteroauth.php');
require_once('config.php');

$status = urlencode($_POST['tweet']);

if (empty($_SESSION['access_token']) || empty($_SESSION['access_token']['oauth_token']) || empty($_SESSION['access_token']['oauth_token_secret']))
{
	echo 'error';
}
else
{
// get user access tokens from the session.
$access_token = $_SESSION['access_token'];

// create a TwitterOauth object with tokens.
$twitteroauth = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET, $access_token['oauth_token'], $access_token['oauth_token_secret']);

//update the status
$update_status = $twitteroauth->POST("https://api.twitter.com/1.1/statuses/update.json?status=".$status);
	
}

if($update_status->user->id != "") // if status is updated
echo "true";
?>