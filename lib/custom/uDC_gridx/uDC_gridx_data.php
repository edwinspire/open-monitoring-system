<?php
include "../../uDC/pguDC.php";
header('Content-type: application/json');

$result = "{}";

if (isset($_POST["udc_action"])) {

$db = new pguDCGrid();
$db->connect($_POST["udc_table"]);
	if(false){
//	if(!$db->access_control(0)){
header('HTTP/1.1 401 Unauthorized', true, 401);
                        die();
}else{
        switch ($_POST["udc_action"]) {
case "select":
$result = $db->select_result_as_json();
break;
case "update":
$result = $db->update_resutl_as_json($_POST, array($_POST["udc_id_name_field"]=>$_POST[$_POST["udc_id_name_field"]]), array($_POST["udc_id_name_field"]));
break;
case "delete":
$result = $db->select_result_as_json();
break;
default:

break;
}

}

}

echo $result;
?>
