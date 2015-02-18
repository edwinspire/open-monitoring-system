<?php
ini_set('display_errors', 1);
include "../php/pg.php";

$pGdbconn = pg_connect($conn_string)  or die("Could not connect");
	$result = pg_query_params($pGdbconn, 'SELECT * FROM fun_location_level_edit_xml($1::integer, $2::integer, $3::integer, $4::text, $5::text, $6::timestamp without time zone, $7::boolean);', array($_POST['level'], $_POST['idpk'], $_POST['idfk'], $_POST['name'], $_POST['code'], $_POST['ts'], true));
$val = pg_fetch_result($result, 0, 0);
echo $val;


/*<xsql>
	<uxsql_query driver='postgres' db_conexion_name='db1' native_xml='true'>SELECT * FROM fun_location_level_edit_xml($1::integer, $2::integer, $3::integer, $4::text, $5::text, $6::timestamp without time zone, $7::boolean);</uxsql_query>
		<uxsql_parameter http_post='level'>0</uxsql_parameter>
		<uxsql_parameter http_post='idpk'>0</uxsql_parameter>
		<uxsql_parameter http_post='idfk'>0</uxsql_parameter>
		<uxsql_parameter http_post='name'></uxsql_parameter>
		<uxsql_parameter http_post='code'></uxsql_parameter>
		<uxsql_parameter http_post='ts'>2000-01-01 12:12:12.121212</uxsql_parameter>	
		<uxsql_parameter name='fields_as_base64'>true</uxsql_parameter>	
				
</xsql>*/

?>
