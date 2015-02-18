<?php
ini_set('display_errors', 1);
include "../php/pg.php";


if (isset($_GET['idlocation'])) {
$pGdbconn = pg_connect($conn_string)  or die("Could not connect");
	$result = pg_query_params($pGdbconn, 'SELECT * FROM fun_view_locations_ids_from_idlocation_xml($1::integer);', array($_GET['idlocation']));
$val = pg_fetch_result($result, 0, 0);
echo $val;
}else{
echo "<table></table>";
}

/*<xsql>
	<uxsql_query driver='postgres' db_conexion_name='db1' native_xml='true'>SELECT * FROM fun_view_locations_ids_from_idlocation_xml($1::integer);</uxsql_query>
		<uxsql_parameter http_get='idlocation'></uxsql_parameter>
				
</xsql>*/

?>
