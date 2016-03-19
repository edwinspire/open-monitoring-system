<?php
require_once "lib/custom/uDC/pguDC.php";
    $db = new pguDC();
    $db->connect();

	if(!$db->login()){
header("Location: login.php");
die();
}else{
header("Location: index.php");
}
?>
