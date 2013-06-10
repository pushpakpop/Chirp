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

//get the latest 10 tweets of the current user from his home timline
$user_tweets = $twitteroauth->get("https://api.twitter.com/1.1/statuses/home_timeline.json?screen_name=".$user_info->screen_name."&count=10&contributor_details=true");

header('Content-type: application/json; charset=utf-8');


echo json_encode($user_tweets);


?>