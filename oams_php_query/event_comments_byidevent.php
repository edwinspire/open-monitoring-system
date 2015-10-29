<?php

//ini_set('display_errors', 0);
include "../oams_php_script_private/pg_conn_string.php";
include "../common_php_script/pg_result_to_json.php";

header('Content-type: application/json');
$pGdbconn = pg_connect($conn_string) or die("Could not connect");

$result = false;
if (isset($_POST["idevent"])) {
    $result = pg_query_params($pGdbconn, "SELECT * FROM event_comments WHERE idevent = $1::integer", array($_POST["idevent"]));
}
echo pg_result_to_json($result);
?>
