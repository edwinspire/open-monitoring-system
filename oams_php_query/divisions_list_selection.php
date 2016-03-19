<?php


include "../oams_php_script_private/oams_db.php";

header('Content-type: application/json');

    $db = new oamsDB();
    $db->connect();
echo $db->query_params_result_as_json("SELECT iddivision as id, name FROM divisions WHERE length(name) > 0  ORDER BY name", array());
?>
