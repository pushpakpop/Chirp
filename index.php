<?php 

session_start();
// Check if user has already logged in to the application
if (isset($_SESSION['access_token']) || isset($_SESSION['access_token']['oauth_token']) || isset($_SESSION['access_token']['oauth_token_secret']))
{
    header('Location: home');
}
?>
<!DOCTYPE html>
<html>
<head>
<style type="text/css">
body {
	text-align: center;
	background: #545454;
	}
#wrapper {
	margin-top:8%;
}
h1 {
	font-size: 40px;
	color: #FFF	;
	margin-top: 0px;
	margin-bottom: 40px;
}
#twitter {
	width: 200px;
	}
</style>
<link rel="icon" type="image/png" href="images/Chirp.png" />
<title>Chirp</title>
</head>

<body>
	<div id="wrapper">
    	<img src="images/Chirp.png">
        <h1>Chirp</h1>
		<p><a href="login.php"><img id="twitter" src="images/login-twitter.png" alt=""></a></p>.
	</div>
</body>
</html>