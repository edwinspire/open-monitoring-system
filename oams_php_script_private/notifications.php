
<?php 
require_once "lib/custom/uDC/pguDC.php";
    $db = new pguDC();
    $db->connect();

$result = "[{}]";

/*
    if ($db->access_control(0)) {

switch($_GET["maptype"]){
case 0:
// Muestra todos los abonados del sistema
$result =  pguDC::result_to_json("accounts", pg_query_params($db->connection, "SELECT account, last_name, first_name, geox, geoy, address, address_ref FROM accounts WHERE enabled = true AND geox != 0 AND geoy != 0;", array()));
break;
case 1:
// Muestra solo el abonado seleccionado
if(isset($_GET["idcontact"]) && $_GET["idcontact"] > 0){
$result =  pguDC::result_to_json("accounts", pg_query_params($db->connection, "SELECT account, last_name, first_name, geox, geoy, address, address_ref FROM accounts WHERE idcontact = $1::bigint AND geox != 0 AND geoy != 0;", array($_GET["idcontact"])));
}
break;
case 2:
// Muestra los abonados asignados al contacto pasado como parametro
if(isset($_GET["idcontact"]) && $_GET["idcontact"] > 0){
$result =  pguDC::result_to_json("accounts", pg_query_params($db->connection, "SELECT account, last_name, first_name, geox, geoy, address, address_ref FROM accounts WHERE idcontact IN (SELECT idaccount FROM view_account_contacts WHERE idcontact = $1::bigint AND appointment = 'Técnico Responsable') AND geox != 0 AND geoy != 0;", array($_GET["idcontact"])));
}
break;
}

    } else {
        header('HTTP/1.1 401 Unauthorized', true, 401);
    }

echo "var geodata = ".$result."\n\r";
*/
?>
