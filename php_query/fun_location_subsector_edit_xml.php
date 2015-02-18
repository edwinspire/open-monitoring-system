<?php
ini_set('display_errors', 1);
include "../php/pg.php";

$pGdbconn = pg_connect($conn_string)  or die("Could not connect");
	$result = pg_query_params($pGdbconn, 'SELECT * FROM fun_location_subsector_edit_xml($1::integer, $2::integer, $3::text, $4::timestamp without time zone, $5::boolean);', array($_POST['idsector'], $_POST['idsubsector'], $_POST['name'], $_POST['ts'], true));
$val = pg_fetch_result($result, 0, 0);
echo $val;


/*<xsql>
	<uxsql_query driver='postgres' db_conexion_name='db1' native_xml='true'>SELECT * FROM fun_location_subsector_edit_xml($1::integer, $2::integer, $3::text, $4::timestamp without time zone, $5::boolean);</uxsql_query>
		<uxsql_parameter http_post='idsector'></uxsql_parameter>
		<uxsql_parameter http_post='idsubsector'></uxsql_parameter>
		<uxsql_parameter http_post='name'></uxsql_parameter>
		<uxsql_parameter http_post='ts'></uxsql_parameter>		
		<uxsql_parameter name='fields_as_base64'>true</uxsql_parameter>	
				
</xsql>*/

?>
