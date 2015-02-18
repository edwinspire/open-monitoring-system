<?php
ini_set('display_errors', 1);
include "../php/pg.php";

$pGdbconn = pg_connect($conn_string)  or die("Could not connect");
	$result = pg_query_params($pGdbconn, 'SELECT * FROM fun_view_subsector_by_idsector_xml($1::integer, $2::boolean);', array($_GET('idsector'), true));
$val = pg_fetch_result($result, 0, 0);
echo $val;


/*TODO: No implementado*/

?>
