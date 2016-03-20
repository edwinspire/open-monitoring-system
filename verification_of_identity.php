<?php
ini_set('display_errors', ALL);
require_once "lib/custom/uDC/pguDC.php";
    $db = new pguDC();
    $db->connect();

//print_r($_POST);

	if(!$db->login()){
header("Location: login.php");
die();
}else{
header("Location: index.php");
}
?>
