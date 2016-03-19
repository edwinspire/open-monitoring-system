<?php
ini_set('display_errors', -1);
include "../../uDC/pguDC.php";
header('Content-type: application/json');

$result = "{}";

if (isset($_POST["udc_action"])) {

$db = new pguDCGrid();
$db->connect();
	if(!$db->access_control(0)){
header('HTTP/1.1 401 Unauthorized', true, 401);
                        die();
}else{
        switch ($_POST["udc_action"]) {
case "select":
$db->use_table($_POST["udc_table"]);
$result = $db->select_where_result_as_json(array(), array("idcontact"=>$_POST["idcontact"]));
break;
case "update":
$db->use_table("emails");
$result = $db->update_resutl_as_json($_POST, array($_POST["udc_referential_field"]=>$_POST[$_POST["udc_referential_field"]]), array("ts"));
break;
case "insert":
$db->use_table("emails");
$result = $db->insert_result_as_json($_POST);
break;
case "delete":
//$result = $db->select_result_as_json();
break;
case "delete_selection":
//$result = $db->delete_selection_result_as_json($_POST["udc_referential_field"], $_POST["udc_selected_id"]);
break;
default:

break;
}

}

}

echo $result;
?>
