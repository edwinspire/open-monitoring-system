<?php
//ini_set('display_errors', 0);
include "../php/pg.php";
ini_set('display_errors', 1);
header('Content-type: application/json');
$pGdbconn = pg_connect($conn_string)  or die("Could not connect");
	$result = pg_query_params($pGdbconn, 'SELECT * FROM fun_groups_edit($1::integer, $2::boolean, $3::text, $4::text, $5::timestamp without time zone, $6::boolean);', array($_POST['idgroup'], $_POST['enable'], $_POST['name'], $_POST['note'], '2000-01-01 00:00', 'false'));
if (!$result) {
  echo "An error occurred.\n";
  exit;
}
// Get an array of all author names
$arr = pg_fetch_all($result);

echo json_encode($arr);


/*<xsql>
	<uxsql_query driver='postgres' native_xml='true' db_conexion_name='db1'>SELECT * FROM fun_groups_edit_xml($1::integer, $2::boolean, $3::text, $4::text, $5::timestamp without time zone, $6::boolean);</uxsql_query>
		<uxsql_parameter http_post='idgroup'></uxsql_parameter>	
		<uxsql_parameter http_post='enable'></uxsql_parameter>	
		<uxsql_parameter http_post='name'></uxsql_parameter>	
		<uxsql_parameter http_post='note'></uxsql_parameter>	
		<uxsql_parameter http_post='ts'>2000-01-01 12:12:12.124456</uxsql_parameter>	
		<uxsql_parameter name='fields_as_base64'>true</uxsql_parameter>	
				
</xsql>*/

?>
