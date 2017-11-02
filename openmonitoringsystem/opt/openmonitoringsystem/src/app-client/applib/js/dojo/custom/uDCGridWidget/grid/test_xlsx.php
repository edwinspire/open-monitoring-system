<?php
ini_set('display_errors', -1);
include "../../uDC/pguDC.php";
//header('Content-type: application/json');

$result = "{'action': 'none', 'error': 'Ninguna accion realizada'}";

$db = new pguDCGrid();
$db->connect("view_events_monitor");
$result = $db->export_as_xlsx($db->query_params("SELECT * FROM view_events_monitor WHERE priority > 0", array()), true, "Esta es una  prueba inicial");

//echo $result;
?>
