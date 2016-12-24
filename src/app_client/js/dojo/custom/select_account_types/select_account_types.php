<?php
ini_set('display_errors', ALL);
require_once $_SERVER['DOCUMENT_ROOT']."/js/dojo/custom/uDC/pguDC.php";
    $db = new pguDC();
    $db->connect();

echo '<div>
	<select data-dojo-attach-point="Select" style="width:95%" class="select2_group form-control input-group-sm">';

    $result = pg_query_params($db->connection, "SELECT idaccounttype, name FROM account_types order by name;", array());
    if (!$result) {
        echo "An error occurred.\n";
    } else {

echo '<option value="0" selected>Ninguno</option>';
        while ($row = pg_fetch_assoc($result)) {
echo '<option value="'.$row["idaccounttype"].'">'.$row["name"].'</option>';
        }
    }

echo "                          </select>
 </div>"
?>
