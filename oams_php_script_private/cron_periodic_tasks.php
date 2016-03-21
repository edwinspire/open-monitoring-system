<?php
require_once "lib/custom/uDC/pguDC.php";
    $db = new pguDC();
    $db->connect();

$tresult = pg_query_params($db->connection, "SELECT * FROM fun_set_expired_events();", array());
$tresult2 = pg_query_params($db->connection, "SELECT * FROM fun_remove_notifications_old();", array());

?>
