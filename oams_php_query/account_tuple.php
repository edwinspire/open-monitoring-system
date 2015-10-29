<?php

//ini_set('display_errors', 0);
require_once "../oams_php_script_private/oams_db.php";

    $db = new oamsDB();
    $db->connect();
//   $db->mapper_table();

header('Content-type: application/json');

$result = array();

if (isset($_POST["query_type"])) {

	if(!$db->access_control(0)){
header('HTTP/1.1 401 Unauthorized', true, 401);
                        die();
}else{

        switch ($_POST["query_type"]) {

            case "insert":
		$result = "{\"insert\": \"".$db->insert("accounts", $_POST, array("idcontact"))."\"}";
                break;

            case "update":
                if (isset($_POST["idcontact"])) {
		$result = "{\"updated\": \"".$db->update("accounts",  
							$_POST, 
							array("idcontact"=>$_POST["idcontact"]),
							array("idcontact", "ts"))."\"}";
                } else {
                    $result = "{\"updated\": \"error, no idcontact\"}";
                }

                break;

            case "select":
                if (isset($_POST["idcontact"])) {
		$result = $db->select_result_as_json("accounts", array(), array("idcontact"=>$_POST["idcontact"]));
                }
                break;
            case "delete":
                if (isset($_POST["idcontact"])) {
		$result = "{\"deleted\": \"".$db->delete("accounts", array("idcontact"=>$_POST["idcontact"]))."\"}";
                }else{
 $result = "{\"deleted\": \"error, no idcontact\"}";
}
                break;
        }

}


} else {
    echo 'No hay definido un tipo de query </br>';
}
echo $result;
?>
