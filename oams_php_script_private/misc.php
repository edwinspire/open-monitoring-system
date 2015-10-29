<?php
//require_once "../../../oams_php_script_private/_DBMAP_open_ams.php";
require_once "_DBMAP_open_ams.php";

function get_table_column_label($table, $column){
$r = "Sin etiqueta";
if(isset($GLOBALS["dbmap_open_ams"][$table][$column]["label"])){
$r = $GLOBALS["dbmap_open_ams"][$table][$column]["label"];
}
return $r;
}


?>
