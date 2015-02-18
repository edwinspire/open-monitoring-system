<?php
ini_set('display_errors', 1);
include "../php/pg.php";

$pGdbconn = pg_connect($conn_string)  or die("Could not connect");
	$result = pg_query_params($pGdbconn, 'SELECT * FROM usaga.fun_event_insert_manual_xml($1::integer, $2::text, $3::integer, $4::integer, $5::text, $6::integer, $7::timestamp without time zone, $8::text, $9::boolean);', array($_POST('idaccount'), $_POST('code'), $_POST('zu'), $_POST('priority'), $_POST('description'), $_POST('ideventtype'), $_POST('date'), $_POST('note'), true));
$val = pg_fetch_result($result, 0, 0);
echo $val;


/*<xsql>
	<uxsql_query driver='postgres' db_conexion_name='db1' native_xml='true'>SELECT * FROM usaga.fun_event_insert_manual_xml($1::integer, $2::text, $3::integer, $4::integer, $5::text, $6::integer, $7::timestamp without time zone, $8::text, $9::boolean);</uxsql_query>
		<uxsql_parameter http_get='idaccount'>0</uxsql_parameter>
		<uxsql_parameter http_get='code'>00</uxsql_parameter>
		<uxsql_parameter http_get='zu'>0</uxsql_parameter>
		<uxsql_parameter http_get='priority'>100</uxsql_parameter>
		<uxsql_parameter http_get='description'></uxsql_parameter>
		<uxsql_parameter http_get='ideventtype'>0</uxsql_parameter>
		<uxsql_parameter http_get='date'>2000-01-01 00:00</uxsql_parameter>
		<uxsql_parameter http_get='note'></uxsql_parameter>			
		<uxsql_parameter name='fields_as_base64'>true</uxsql_parameter>	
				
</xsql>*/

?>
