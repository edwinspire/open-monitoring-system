<?php
include "../oams_php_script_private/oams_db.php";
header('Content-type: application/json');

    $db = new oamsDB();
    $db->connect();

$result = "{}";

if(isset($_POST["idcontact"])){
	if($db->access_control(0)){
$result = $db->query_params_result_as_json("select * from fun_view_contact_groups_they_belong($1::bigint)", array("idcontact"=>$_POST["idcontact"]));
		}else{
header('HTTP/1.1 401 Unauthorized', true, 401);
}
}
echo $result;
?>
