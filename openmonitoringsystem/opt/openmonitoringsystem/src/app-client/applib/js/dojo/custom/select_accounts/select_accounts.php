<?php
ini_set('display_errors', ALL);
require_once $_SERVER['DOCUMENT_ROOT']."/js/dojo/custom/uDC/pguDC.php";
    $db = new pguDC();
    $db->connect();

echo '<div>
	<select data-dojo-attach-point="Select" style="width:95%" class="select2_group form-control input-group-sm">';

    $result = pg_query_params($db->connection, "SELECT idcontact, account_division, enabled, (enabled::text||' | '||account::text||' | '||account_name::text) as account_descrip  FROM view_accounts order by account_division, account_name;", array());
    if (!$result) {
        echo "An error occurred.\n";
    } else {

$group = "";

        while ($row = pg_fetch_assoc($result)) {

if($row["account_division"] != $group && $group != ""){
echo "
</optgroup>
";
}else if($row["account_division"] == $group){
echo '<option value="'.$row["idcontact"].'">'.$row["account_descrip"].'</option>';
}

if($row["account_division"] != $group ){
$group = $row["account_division"];
echo '<optgroup label="'.$row["account_division"].'">';
echo "
";
echo '<option value="'.$row["idcontact"].'">'.$row["account_descrip"].'</option>';
}

        }
    }



echo "                          </select>
 </div>"
?>
