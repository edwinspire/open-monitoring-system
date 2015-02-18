<?php
include "../php/pg.php";
ini_set('display_errors', 1);
header('Content-type: application/json');
$pGdbconn = pg_connect($conn_string)  or die("Could not connect");

$result = pg_query_params($pGdbconn, 'SELECT * FROM view_contacts_groups WHERE idcontact = $1::INTEGER ORDER BY name;', array($_POST['idcontact']));

if (!$result) {
  echo "An error occurred.\n";
  exit;
}
// Get an array of all author names
$arr = pg_fetch_all($result);

echo json_encode($arr);

/*<xsql>
	<uxsql_query driver='postgres' db_conexion_name='db1' native_xml='true'>SELECT * FROM fun_view_contacts_groups_xml($1::integer, $2::boolean);</uxsql_query>
		<uxsql_parameter http_post='idcontact'>0</uxsql_parameter>	
		<uxsql_parameter name='fields_as_base64'>true</uxsql_parameter>	
				
</xsql>*/

?>
