<?php
include "../oams_php_script_private/oams_db.php";
header('Content-type: application/json');

    $db = new oamsDB();
    $db->connect();

$result = "{}";

	if($db->access_control(0)){
$result = $db->select_result_as_json("view_account_contacts", array(), array("idaccount"=>$_POST["idaccount"]), "priority, contact_name");
		}else{
header('HTTP/1.1 401 Unauthorized', true, 401);
}

echo $result;
?>
