<?php
ini_set('display_errors', 1);
include "../php/pg.php";

$pGdbconn = pg_connect($conn_string)  or die("Could not connect");
	$result = pg_query_params($pGdbconn, 'SELECT * FROM usaga.fun_notification_templates_edit_xml($1::integer, $2::text, $3::text, $4::timestamp without time zone, $5::boolean);', array($_POST('idnotiftempl'), $_POST('description'), $_POST('message'), $_POST('ts'), true));
$val = pg_fetch_result($result, 0, 0);
echo $val;


/*<xsql>
	<uxsql_query driver='postgres' db_conexion_name='db1' native_xml='true'>SELECT * FROM usaga.fun_notification_templates_edit_xml($1::integer, $2::text, $3::text, $4::timestamp without time zone, $5::boolean);</uxsql_query>
		<uxsql_parameter http_post='idnotiftempl'>0</uxsql_parameter>		
		<uxsql_parameter http_post='description'></uxsql_parameter>		
		<uxsql_parameter http_post='message'></uxsql_parameter>			
		<uxsql_parameter http_post='ts'>2000-01-01 00:00:00.000000</uxsql_parameter>		
		<uxsql_parameter name='fields_as_base64'>true</uxsql_parameter>	
				
</xsql>*/

?>
