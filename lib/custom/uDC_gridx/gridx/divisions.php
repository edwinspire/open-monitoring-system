<?php
ini_set('display_errors', -1);
include "../../uDC/pguDC.php";
header('Content-type: application/json');

$result = "{}";

if (isset($_POST["udc_action"])) {

$db = new pguDCGrid();
$db->connect($_POST["udc_table"]);
//	if(false){
	if(!$db->access_control(0)){
header('HTTP/1.1 401 Unauthorized', true, 401);
                        die();
}else{
        switch ($_POST["udc_action"]) {
case "select":
$result = $db->select_result_as_json(array(), "name");
break;
case "update":
$result = $db->update_resutl_as_json($_POST, array($_POST["udc_referential_field"]=>$_POST[$_POST["udc_referential_field"]]), array($_POST["udc_referential_field"]));
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
case "grid_export":
header('Content-type: application/vnd.oasis.opendocument.spreadsheet');
header("Content-Disposition:attachment;filename=report.ods");
$result = $db->export_as_html(true, $title = "Empresas [Divisiones]", array(), array(), "name", 0, "iddivision", json_decode($_POST["udc_selected_id"]));
break;
$result = $db->select_result_as_json(array(), "name");

default:

break;
}

}

}


echo $result;
?>
