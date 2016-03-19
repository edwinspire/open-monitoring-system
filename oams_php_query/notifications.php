<?php

//ini_set('display_errors', 0);
include_once "../lib/custom/uDC/pguDC.php";

header('Content-type: application/json');
    $db = new pguDC();
    $db->connect();

	if($db->access_control(0)){

$lastidnotify = isset($_POST['lastidnotify']) ? $_POST['lastidnotify'] : '0';

  //  $db = new oamsDB();
   // $db->connect();

                $result = $db->query_params_result_as_json("SELECT * FROM notification_area WHERE (sessionid = 'all' OR sessionid = $1::text) AND idnotify > $2::integer ORDER BY urgency, idnotify", array($_COOKIE["oams_sessionid"], $lastidnotify));

}

echo $result;
?>
