<?php

//ini_set('display_errors', 0);
require_once "../oams_php_script_private/oams_db.php";

    $db = new oamsDB();
    $db->connect();
   $db->mapper_table();

$result = false;

if (isset($_POST["idaccount"])) {

    session_start();

    if ($db->access_control(0)) {

                if ($_POST["idaccount"] > 0) {
                    $result = $db->select_result_as_json("accounts", array("account", "last_name", "first_name", "geox", "geoy", "address", "address_ref"), array("idcontact"=>$_POST["idaccount"]));
                            //pg_query_params($pGdbconn, "SELECT * FROM accounts WHERE idcontact = $1::integer", array($_POST["idaccount"]));
                }else if($_POST["idaccount"]  == -100){
$result =  oamsDB::result_to_json("accounts", pg_query_params($db->connection, "SELECT account, last_name, first_name, geox, geoy, address, address_ref FROM accounts WHERE enabled = true AND geox != 0 AND geoy != 0;", array()));
}

    } else {
        header('HTTP/1.1 401 Unauthorized', true, 401);
    }
} else {
    echo 'No ha definido idaccount </br>';
}
echo $result;
?>
