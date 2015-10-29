<?php
include "../oams_php_script_private/oams_db.php";
header('Content-type: application/json');

    $db = new oamsDB();
    $db->connect();
   $db->mapper_table();

$result = "{}";

	if($db->access_control(0)){
if(isset($_POST["query_type"])){

    $db = new oamsDB();
    $db->connect();
    $db->mapper_table("equipments");

switch($_POST["query_type"]){

case "select":
            if (isset($_POST["idaccount"])) {
                $result = $db->select_result_as_json("equipments", array(), array("idaccount" => $_POST["idaccount"]), "idequipment");
            }else{
$result = $db->select("equipments", array(), array(), "idequipment");

}
break;
case "insert":
    //  $result = $db->insert("equipments", $_POST);
$result = "{\"insert\": \"".$db->insert("equipments", $_POST)."\"}";
break;
case "update":
//      $result = $db->update("equipments", $_POST, array("idequipment", "ts"), array("ts"), array(), array("equipment"));
                if (isset($_POST["idequipment"])) {
		$result = "{\"updated\": \"".$db->update("equipments",  
							$_POST, 
							array("idequipment"=>$_POST["idequipment"]),
							array("idequipment", "ts"))."\"}";
                } else {
                    $result = "{\"updated\": \"error\"}";
                }
break;
case "delete_selection":
//      $result = $db->delete("equipments", $_POST);
$result = pg_query_params($db->connection, 'DELETE FROM equipments WHERE idequipment = ANY($1::INTEGER[])', array("{".$_POST["selected_ids"]."}"));
/*
                if (isset($_POST["idcontact"])) {
		$result = "{\"deleted\": \"".$db->delete("accounts", array("idcontact"=>$_POST["idcontact"]))."\"}";
                }else{
 $result = "{\"deleted\": \"error, no idcontact\"}";
}*/
break;
}


}
		}else{
header('HTTP/1.1 401 Unauthorized', true, 401);
}

echo $result;

/*

//ini_set('display_errors', 0);
include "../oams_php_script_private/pg_conn_string.php";
include "../oams_php_script_private/security.php";
include "../common_php_script/pg_result_to_json.php";
include "../oams_php_script_private/oams_db.php";


//ini_set('display_errors', 1);
header('Content-type: application/json');
$pGdbconn = pg_connect($conn_string) or die("Could not connect");
session_start();
$result = false;

if(isset($_POST["query_type"])){

    $db = new oamsDB();
    $db->connect();
    $db->mapper_table("equipments");

switch($_POST["query_type"]){

case "select":
            if (isset($_POST["idaccount"])) {
                $result = $db->select("equipments", array(), array("idaccount" => $_POST["idaccount"]), "idequipment");
            }else{
$result = $db->select("equipments", array(), array(), "idequipment");

}
break;
case "insert":
      $result = $db->insert("equipments", $_POST);
break;
case "update":
      $result = $db->update("equipments", $_POST, array("idequipment", "ts"), array("ts"), array(), array("equipment"));
break;
case "delete_selection":
//      $result = $db->delete("equipments", $_POST);
$result = pg_query_params($db->connection, 'DELETE FROM equipments WHERE idequipment = ANY($1::INTEGER[])', array("{".$_POST["selected_ids"]."}"));
break;
}


}
*/
//echo $result;
?>
