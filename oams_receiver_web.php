<?php
//ini_set('display_errors', 0);
include "oams_php_script_private/pg_conn_string.php";
include "common_php_script/pg_result_to_json.php";

header('Content-type: application/json');
$pGdbconn = pg_connect($conn_string)  or die("Could not connect");

$result = false;



if(isset($_POST["id"])){
	$result = pg_query_params($pGdbconn, "SELECT * FROM accounts WHERE idcontact = $1::integer", array($_POST["id"]));
}else{
//header('HTTP/1.1 401 Unauthorized', true, 401);
}

echo $_SERVER['REMOTE_ADDR'];
print_r($_POST);
echo pg_result_to_json($result);
?>
