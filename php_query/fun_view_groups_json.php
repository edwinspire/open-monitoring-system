<?php
//ini_set('display_errors', 1);
include "../php/pg.php";

header('Content-type: application/json');
$pGdbconn = pg_connect($conn_string)  or die("Could not connect");

$result = pg_query($pGdbconn, "SELECT * FROM groups");
if (!$result) {
  echo "An error occurred.\n";
  exit;
}
// Get an array of all author names
$arr = pg_fetch_all($result);

echo json_encode($arr);

/*<xsql>
	<uxsql_query driver='postgres' db_conexion_name='db1' native_xml='true'>SELECT * FROM fun_view_groups_xml($1::boolean);</uxsql_query>
		<uxsql_parameter name='fields_as_base64'>true</uxsql_parameter>	
				
</xsql>*/

?>
