
<?php 
require_once "../../php_lib/send_email.php";
require_once "../../lib/custom/uDC/pguDC.php";
    $db = new pguDCGrid();
    $db->connect();


$result = $db->query_as_html_table("SELECT account, account_name, dateevent, priority, label, description, oams_assigned  FROM view_events_monitor WHERE dateevent < (now() - interval '24 hour') AND ideventtype = 59  ORDER BY account, dateevent, priority", array(), true, "SERVIDORES SIN REINICIAR POR MAS DE 14 DIAS");

//echo $result;
SendEmail("Servidores sin reiniciar por mas de 14 dias", $result, "edwinspire@gmail.com");

?>
