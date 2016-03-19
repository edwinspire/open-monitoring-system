<?php
include "../uDC/pguDC.php";
ini_set('display_errors', -1);
header('Content-type: application/javascript');
$structure = new pguDCGrid();
$structure->connect($_POST["udc_gridx_structure_table"]);
echo $structure->structure($_POST);
?>
