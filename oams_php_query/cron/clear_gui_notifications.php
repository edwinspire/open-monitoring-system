<?php
include_once "oams_db.php";

$count_seconds = 0;
$last_ts = array();

    $db = new oamsDB();
    $db->connect();

$tresult = pg_query_params($db->connection, "SELECT * FROM fun_set_expired_events();", array());
$tresult2 = pg_query_params($db->connection, "SELECT * FROM fun_remove_notifications_old();", array());

?>
