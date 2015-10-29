<?php
require_once "../oams_php_script_private/oams_db.php";
header('Content-type: application/json');

    $db = new oamsDB();
    $db->connect();
//   $db->mapper_table();
$result = array();

	if(!$db->access_control(0)){
header('HTTP/1.1 401 Unauthorized', true, 401);
                        die();
}else{

if (isset($_POST["idaccount"]) && isset($_POST["type_grid"])) {
    switch ($_POST["type_grid"]) {
        case "0":
            // Muestra los 500 ultimos eventos de todas las cuentas (para el log de eventos)
           // $result = pg_query_params($db->connection, "SELECT * FROM view_events_monitor LIMIT 200;", array());
		$result = $db->select_result_as_json("view_events_monitor", array(), array(), "", 200);
            break;
        case "1":
            // Muestra los 1500 ultimos eventos de la cuenta seleccionada (para el visor de eventos del abonado)
            //$result = pg_query_params($db->connection, "SELECT * FROM view_events_monitor WHERE idaccount = $1::integer;", array($_POST["idaccount"]));
	    $result = $db->select_result_as_json("view_events_monitor", array(), array("idaccount"=>$_POST["idaccount"]), "", 1000);
            break;
        case "2":
            // Muestra los 1500 ultimos eventos no cerrados de todas las cuentas (para el administrador de eventos del abonado)
            $result = $db->query_params_result_as_json("SELECT * FROM view_events_monitor WHERE status IN(0)", array());
            break;
        case "3":
            // Muestra los 500 ultimos eventos de todas las cuentas (para el monitor de eventos)
            $result = oamsDB::result_to_json("view_events_monitor", pg_query_params($db->connection, "SELECT * FROM view_events_monitor WHERE status IN(0);", array()));
            break;
    }
} else {
//    $result = pg_query_params($pGdbconn, "SELECT * FROM view_events_monitor LIMIT 200;", array());
		$result = $db->select_result_as_json("view_events_monitor", array(), array(), "", 200);
}

echo $result;

}
