<?php

//ini_set('display_errors', 0);
include "../oams_php_script_private/pg_conn_string.php";
include "../common_php_script/pg_result_to_json.php";

header('Content-type: application/json');
//session_start();
$pGdbconn = pg_connect($conn_string) or die("Could not connect");

$lastidnotify = isset($_POST['lastidnotify']) ? $_POST['lastidnotify'] : '0';
$result = pg_query_params($pGdbconn, "SELECT * FROM notification_area WHERE (sessionid = 'all' OR sessionid = $1::text) AND idnotify > $2::integer ORDER BY urgency, idnotify;", array(session_id(), $lastidnotify));
echo pg_result_to_json($result);
/*
  if (!$result) {
  echo "An error occurred.\n";
  exit;
  }


  $arr = pg_fetch_all($result);
  echo json_encode($arr);
 */
?>
