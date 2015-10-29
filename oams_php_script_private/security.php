<?php

ini_set('display_errors', 1);
require_once "oams_db.php";
function CheckPageAccess($level){
    $db = new oamsDB();
    $db->connect();
   $db->mapper_table();
	if(!$db->access_control($level)){
header("Location: login.php");
                       die();
}

}

?>
