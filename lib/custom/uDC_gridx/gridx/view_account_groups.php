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
$result = $db->query_params_result_as_json("SELECT * FROM fun_view_contact_groups_they_belong($1::bigint)", array("idaccount"=>$_POST["idaccount"]));
break;
case "update":
$db->use_table("accounts");
$q = "";
if($_POST["ismember"] == "false"){
//array_remove(anyarray, anyelement)
$q = "UPDATE contacts SET groups = array_remove(groups, $1::INT) WHERE idcontact = $2::BIGINT RETURNING idcontact";
}else{
//array_append(anyarray, anyelement)
$q = "UPDATE contacts SET groups = array_append(groups, $1::INT) WHERE idcontact = $2::BIGINT RETURNING idcontact";
}

$result = json_encode(array("update"=>pg_affected_rows (pg_query_params($db->connection, $q, array("idgroup"=>$_POST["idgroup"], "idcontact"=>$_POST["idcontact"]))),
"error"=>pg_last_error($db->connection), "notice"=>pg_last_notice($db->connection)));

break;
case "insert":
//$result = $db->insert_result_as_json($_POST);
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
