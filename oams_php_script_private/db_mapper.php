<?php

ini_set('display_errors', 1);
require_once "oams_db.php";

    $db = new oamsDB();
    $db->connect();
   $db->db_mapper();

?>
