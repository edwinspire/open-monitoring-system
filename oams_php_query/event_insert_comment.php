<?php
include "../oams_php_script_private/oams_db.php";
header('Content-type: application/json');

    $db = new oamsDB();
    $db->connect();
 //  $db->mapper_table();

$result = "{}";

	if($db->access_control(0)){

        if (isset($_POST["selected"]) && $_POST["selected"] == 'true') {
            $result = oamsDB::result_to_json(pg_query_params($db->connection, "SELECT fun_msg, fun_return FROM  fun_event_comment_insert_selected($1::integer[], $2::integer, $3::text, $4::integer, $5::integer);", array("{" . $_POST["idevent"] . "}", $_POST["seconds"], $_POST["comment"], $_POST["status"], $db->idadmin)));
        } else {
            $result = oamsDB::result_to_json(pg_query_params($db->connection, "INSERT INTO event_comments (idevent, seconds, comment_event, status, idadmin) VALUES ($1::integer, $2::integer, $3::text, $4::integer, $5::integer);", array($_POST["idevent"], $_POST["seconds"], $_POST["comment"], $_POST["status"], $db->idadmin)));
        }


		}else{
header('HTTP/1.1 401 Unauthorized', true, 401);
}

echo $result;
?>

