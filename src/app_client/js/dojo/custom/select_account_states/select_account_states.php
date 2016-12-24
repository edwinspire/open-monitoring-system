<?php
ini_set('display_errors', ALL);
require_once $_SERVER['DOCUMENT_ROOT']."/js/dojo/custom/uDC/pguDC.php";
    $db = new pguDC();
    $db->connect();

echo '<div>
	<select data-dojo-attach-point="Select" style="width:95%" class="select2_group form-control input-group-sm" value="0">';

    $result = pg_query_params($db->connection, "SELECT idaccountstate, state FROM account_states order by state;", array());
    if (!$result) {
        echo "An error occurred.\n";
    } else {

        while ($row = pg_fetch_assoc($result)) {
echo '<option value="'.$row["idaccountstate"].'">'.$row["state"].'</option>';
        }
    }

echo "                          </select>
 </div>"
?>
