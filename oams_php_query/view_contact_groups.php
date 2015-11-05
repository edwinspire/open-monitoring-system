<?php
include "../oams_php_script_private/oams_db.php";
header('Content-type: application/json');

    $db = new oamsDB();
    $db->connect();

$result = "{}";

if(isset($_POST["idcontact"])){

	if($db->access_control(0)){

switch($_POST["query_type"]){

case "select":
$result = $db->query_params_result_as_json("select * from fun_view_contact_groups_they_belong($1::bigint)", array("idcontact"=>$_POST["idcontact"]));
break;

case "update":

if($_POST["ismember"] == false){
//array_remove(anyarray, anyelement)
$result = "{'update': ".pg_affected_rows (pg_query_params($db->connection, "UPDATE contacts SET groups = array_remove(groups, $1::INT) WHERE idcontact = $2::BIGINT RETURNING idcontact", array("idgroup"=>$_POST["idgroup"], "idcontact"=>$_POST["idcontact"])))."}";
}else{
//array_append(anyarray, anyelement)
$result = "{'update': ".pg_affected_rows (pg_query_params($db->connection, "UPDATE contacts SET groups = array_append(groups, $1::INT) WHERE idcontact = $2::BIGINT RETURNING idcontact", array("idgroup"=>$_POST["idgroup"], "idcontact"=>$_POST["idcontact"])))."}";
}


break;
}

		}else{
header('HTTP/1.1 401 Unauthorized', true, 401);
}
}
echo $result;
?>
