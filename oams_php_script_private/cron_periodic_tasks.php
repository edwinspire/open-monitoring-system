<?php
require_once "/mnt/a9fad31c-8f37-4e7e-a5c7-72813634828d/Desarrollo/open-ams/lib/custom/uDC/pguDC.php";
    $db = new pguDC();
    $db->connect();

$tresult = pg_query_params($db->connection, "SELECT * FROM fun_set_expired_events();", array());
$tresult2 = pg_query_params($db->connection, "SELECT * FROM fun_remove_notifications_old();", array());

?>
