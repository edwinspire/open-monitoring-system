<?php

//ini_set('display_errors', 0);
//include "../oams_php_script_private/pg_conn_string.php";
//include "../oams_php_script_private/security.php";
//include "../common_php_script/pg_result_to_json.php";
include "../oams_php_script_private/oams_db.php";


//ini_set('display_errors', 1);
//header('Content-type: application/json');
//$pGdbconn = pg_connect($conn_string) or die("Could not connect");
session_start();
$result = false;

if(isset($_POST["query_type"])){

    $db = new oamsDB();
    $db->connect();
    $db->mapper_table("view_equipments");

switch($_POST["query_type"]){

case "select":
header('Content-type: application/json');
            if (isset($_POST["idaccount"])) {
                $result = $db->select_result_as_json("view_equipments", array(), array("idaccount" => $_POST["idaccount"]), "idequipment");
            }else{
$result = $db->select_result_as_json("view_equipments", array(), array());

}
break;
case "insert":
header('Content-type: application/json');
   //   $result = $db->insert("equipments", $_POST);
break;
case "update":
header('Content-type: application/json');
    //  $result = $db->update("equipments", $_POST, array("idcontact", "ts"), array("ts"), array(), array("equipment"));
break;
case "select_csv":
header('Content-type: application/csv');
header("Content-Disposition:attachment;filename=report.csv");

 if (isset($_POST["selected"])) {
$query = "SELECT * FROM view_equipments WHERE idequipment IN(" . $_POST["idequipments"] . ");";
}else{
$query = "SELECT * FROM view_equipments;";
}

$result = $db->result_to_csv("view_equipments", pg_query_params($db->connection, $query, array()));
break;
case "delete_selection":
//      $result = $db->delete("equipments", $_POST);
$result = pg_query_params($db->connection, 'DELETE FROM equipments WHERE idequipment = ANY($1::INTEGER[])', array("{".$_POST["selected_ids"]."}"));
break;
}


}

//echo pg_result_to_json($result);
echo $result;
?>
