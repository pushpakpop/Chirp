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
</head>

<body>
	<div>
		<a href="login.php">Login with twitter</a>
	</div>
</body>
</html>