<?php

//ini_set('display_errors', 0);
include "../oams_php_script_private/pg_conn_string.php";
include "../common_php_script/pg_result_to_json.php";
//set_time_limit (350);

//header('Content-type: application/json');
//header('Cache-Control: no-cache');
$pGdbconn = pg_connect($conn_string) or die("Could not connect");
$result = pg_query_params($pGdbconn, "SELECT * FROM fun_set_expired_events();", array());
echo pg_result_to_json($result);

$result2 = pg_query_params($pGdbconn, "SELECT * FROM fun_remove_notifications_old();", array());
echo pg_result_to_json($result2);

?>
