<?php
require_once "../oams_php_script_private/oams_db.php";
header('Content-type: application/csv');
header("Content-Disposition:attachment;filename=report.csv");

ini_set('display_errors', -1);

    $db = new oamsDB();
    $db->connect();
//   $db->mapper_table();
$result = array();

	if(!$db->access_control(0)){
header('HTTP/1.1 401 Unauthorized', true, 401);
                      //  die();
}else{

if (isset($_POST["type_grid"]) && isset($_POST["idevents"])) {

    $query = "";
    $param = array();
    $columns = "account , (last_name||' '||first_name) as NAME, dateevent as DATE, label, description, priority, status_label, status, oams_assigned, idevent, idaccount, code, zu AS ZONE_USER, ideventtype, last_comment";

    if (isset($_POST["selected"])) {
        switch ($_POST["type_grid"]) {
            case "0":
                $query = "SELECT " . $columns . " FROM view_events_monitor WHERE idevent IN(" . $_POST["idevents"] . ") LIMIT 200;";
                break;
            case "1":
                $param[0] = $_POST["idaccount"];
                $query = "SELECT " . $columns . " FROM view_events_monitor WHERE idaccount = $1::integer AND idevent IN(" . $_POST["idevents"] . ") ORDER BY dateevent DESC LIMIT 1500;";
                break;
            case "2":
                $query = "SELECT " . $columns . " FROM view_events_monitor WHERE status IN(0) AND idevent IN(" . $_POST["idevents"] . ") ORDER BY last_name, first_name, dateevent LIMIT 1500;";
                break;
            case "3":
                $query = "SELECT " . $columns . " FROM view_events_monitor WHERE status IN(0) AND idevent IN(" . $_POST["idevents"] . ") ORDER BY last_name, first_name, dateevent LIMIT 1500;";
                break;
        }
    } else {
        switch ($_POST["type_grid"]) {
            case "0":
                $query = "SELECT " . $columns . " FROM view_events_monitor ORDER BY last_name, first_name, dateevent LIMIT 1500;";
                break;
            case "1":
                $param[0] = $_POST["idaccount"];
                $query = "SELECT " . $columns . " FROM view_events_monitor WHERE idaccount = $1::integer ORDER BY dateevent DESC LIMIT 1500;";
                break;
            case "2":
                $query = "SELECT " . $columns . " FROM view_events_monitor WHERE status IN(0) ORDER BY last_name, first_name, dateevent LIMIT 1500;";
                break;
            case "3":
                $query = "SELECT " . $columns . " FROM view_events_monitor WHERE status IN(0) ORDER BY last_name, first_name, dateevent LIMIT 1500;";
                break;
        }
    }

//echo $query."</br>";
    $result = pg_query_params($db->connection, $query, $param);
} else {
    $result = pg_query_params($db->connection, "SELECT " . $columns . " FROM view_events_monitor ORDER BY last_name, first_name, dateevent LIMIT 1500;", array());
}

}

echo strip_tags(oamsDB::result_to_csv("view_events_monitor", $result));
?>

