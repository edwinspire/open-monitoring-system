<?php
ini_set('display_errors', -1);
include "../../lib/custom/uDC/pguDC.php";
header('Content-type: application/json');

$result = "{}";

if (isset($_POST["udc_action"])) {

$db = new pguDC();
$db->connect($_POST["udc_table"]);
	if(!$db->access_control(0)){
header('HTTP/1.1 401 Unauthorized', true, 401);
                        die();
}else{
        switch ($_POST["udc_action"]) {
case "select":
$result = $db->select_where_result_as_json(array(), array($_POST["udc_referential_field"]=>$_POST[$_POST["udc_referential_field"]]));
break;
case "update":
$result = $db->update_resutl_as_json($_POST, array($_POST["udc_referential_field"]=>$_POST[$_POST["udc_referential_field"]]), array("ts", "groups"));
break;
case "insert":
$result = $db->insert_result_as_json($_POST);
break;
case "delete":
//$result = $db->select_result_as_json();
break;
case "delete_selection":
$result = $db->delete_selection_result_as_json($_POST["udc_referential_field"], $_POST["udc_selected_id"]);
break;
default:

break;
}

}

}

echo $result;
?>
