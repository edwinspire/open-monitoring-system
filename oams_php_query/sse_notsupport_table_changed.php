<?php

//ini_set('display_errors', 0);
include_once "../lib/custom/uDC/pguDC.php";
//set_time_limit (350);
/*
header('Content-type: application/json');
header('Cache-Control: no-cache');
$pGdbconn = pg_connect($conn_string) or die("Could not connect");
$result = pg_query_params($pGdbconn, "SELECT table_name, ts FROM sys_table_ts;", array());
echo pg_result_to_json($result);
*/
//$count_seconds = 0;
/*
  while(true){


  if (!$result) {
  echo "An error occurred.\n";
  }else{

  while ($row = pg_fetch_assoc($result)) {
  $name = $row["table_name"];
  $ts = $row["ts"];

  if(isset($last_ts[$name])){

  if($last_ts[$name] != $ts){
  $last_ts[$name] = $ts;
  SendMsg($name, $last_ts[$name]);
  }

  }else{
  $last_ts[$name] = $ts;
  SendMsg($name, $last_ts[$name]);
  }

  }

  }
  sleep(3);
  }

  function SendMsg($table, $ts){
  echo "data: {\"table\":\"".$table."\", \"ts\":\"".$ts."\"}".PHP_EOL;
  echo PHP_EOL;
  ob_flush();
  flush();
  }
 */
?>
