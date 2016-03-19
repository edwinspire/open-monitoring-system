<?php
include "../oams_php_script_private/oams_db.php";
header('Content-type: application/json');

    $db = new oamsDB();
    $db->connect();
 //  $db->mapper_table();

$result = "{}";

	if($db->access_control(0)){
if(isset($_POST["query_type"])){

    $db = new oamsDB();
    $db->connect();
 //   $db->mapper_table("equipments");

switch($_POST["query_type"]){

case "select":
            if (isset($_POST["idaccount"])) {
                $result = $db->select_result_as_json("network_devices", array(), array("idaccount" => $_POST["idaccount"]), "idequipment");
            }else{
$result = $db->select("equipments", array(), array(), "idequipment");

}
break;
case "insert":
    //  $result = $db->insert("equipments", $_POST);
$result = "{\"insert\": \"".$db->insert("network_devices", $_POST)."\"}";
break;
case "update":
//      $result = $db->update("equipments", $_POST, array("idequipment", "ts"), array("ts"), array(), array("equipment"));
                if (isset($_POST["idequipment"])) {
		$result = "{\"updated\": \"".$db->update("network_devices",  
							$_POST, 
							array("idequipment"=>$_POST["idequipment"]),
							array("idequipment", "ts"))."\"}";
                } else {
                    $result = "{\"updated\": \"error\"}";
                }
break;
case "delete_selection":
//      $result = $db->delete("equipments", $_POST);
$rd = pg_query_params($db->connection, 'DELETE FROM network_devices WHERE idequipment = ANY($1::INTEGER[])', array("{".$_POST["selected_ids"]."}"));
		$result = "{\"deleted\": \"".pg_affected_rows($rd)."\"}";
break;
}


}
		}else{
header('HTTP/1.1 401 Unauthorized', true, 401);
}

echo $result;

?>
