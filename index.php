<?php 

session_start();
//check if the session contains token and secret keys
if(isset($_SESSION['oauth_token']) && isset($_SESSION['oauth_token_secret']))
{
header('Location: login.php ');
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
</head>

<body>
	<div id="wrapper">
    	<img src="images/Chirp.png">
        <h1>Chirp</h1>
		<p><a href="login.php"><img id="twitter" src="images/login-twitter.png" alt=""></a></p>.
	</div>
</body>
</html>