<?php

ini_set('display_errors', 0);
require_once "oams_db.php";
function CheckPageAccess($level){
echo "hasta aqui ok0";
    $db = new oamsDB();
echo "hasta aqui ok1";
    $db->connect();
echo "hasta aqui ok2";
	if(!$db->access_control($level)){
header("Location: login.php");
                       die();
}

}

?>
