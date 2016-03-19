<?php
include "../oams_php_script_private/uDCGridx.php";
header('Content-type: application/json');
$structure = new uDCGridx();
$structure->connect($_POST["udc_structure_table"]);
echo $structure->structure($_POST);
?>
