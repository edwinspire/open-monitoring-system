<?php
ini_set('display_errors', -1);
include "../../uDC/pguDC.php";
header('Content-type: application/json');

$result = "{'action': 'none', 'error': 'Ninguna accion realizada'}";

if (isset($_POST["udc_action"])) {

$db = new pguDCGrid();
$db->connect($_POST["udc_table"]);
	if(!$db->access_control(0)){
header('HTTP/1.1 401 Unauthorized', true, 401);
                        die();
}else{
        switch ($_POST["udc_action"]) {
case "select":
$result = $db->select_where_result_as_json(array(), array("idaccount"=>$_POST["idaccount"]));
break;
case "update":
$db->use_table("account_users");
$result = $db->update_resutl_as_json($_POST, array($_POST["udc_referential_field"]=>$_POST[$_POST["udc_referential_field"]]), array("ts"));
break;
case "insert":
$db->use_table("account_users");
$result = $db->insert_result_as_json(array('idaccount'=>$_POST['idcontact'], 'idcontact'=>$_POST['account_contact_idcontact'], 'appointment'=>$_POST['appointment'], 'priority'=>$_POST['priority'], 'note'=>$_POST['note'], '"user"'=>$_POST['user'], 'account_user'=>$_POST['account_user'], 'account_pwd'=>$_POST['account_pwd']   ));
break;
case "delete":
//$result = $db->select_result_as_json();
break;
case "delete_selection":
$db->use_table("account_users");
$result = $db->delete_selection_result_as_json($_POST["udc_referential_field"], json_decode($_POST["udc_selected_id"]));
break;
case "grid_export":
header('Content-type: application/vnd.oasis.opendocument.spreadsheet');
header("Content-Disposition:attachment;filename=usuarios_".date('Ymd-His').".ods");
$result = $db->export_as_html(true, "Usuarios", array(), array(), "account_name, user_name", 0, $_POST["udc_referential_field"], json_decode($_POST["udc_selected_id"]));
break;
}

}

}

echo $result;
?>
