<?php
ini_set('display_errors', 1);
include "../php/pg.php";

$pGdbconn = pg_connect($conn_string)  or die("Could not connect");
	$result = pg_query_params($pGdbconn, 'SELECT * FROM usaga.fun_account_notifications_table_xml($1::integer, $2::integer, $3::integer, $4::integer, $5::boolean, $6::boolean, $7::text, $8::text, $9::timestamp without time zone, $10::boolean);', array($_POST('idnotifaccount'), $_POST('idaccount'), $_POST('idphone'), $_POST('priority'), $_POST('call'), $_POST('sms'), $_POST('smstext'), $_POST('note'), $_POST('ts'), true));
$val = pg_fetch_result($result, 0, 0);
echo $val;


/*<xsql>
	<uxsql_query driver='postgres' db_conexion_name='db1' native_xml='true'>SELECT * FROM usaga.fun_account_notifications_table_xml($1::integer, $2::integer, $3::integer, $4::integer, $5::boolean, $6::boolean, $7::text, $8::text, $9::timestamp without time zone, $10::boolean);</uxsql_query>
	<uxsql_parameter http_post='idnotifaccount'>0</uxsql_parameter>
	<uxsql_parameter http_post='idaccount'>0</uxsql_parameter>
	<uxsql_parameter http_post='idphone'>0</uxsql_parameter>
	<uxsql_parameter http_post='priority'>100</uxsql_parameter>
	<uxsql_parameter http_post='call'>false</uxsql_parameter>
	<uxsql_parameter http_post='sms'>false</uxsql_parameter>
	<uxsql_parameter http_post='smstext'></uxsql_parameter>
	<uxsql_parameter http_post='note'></uxsql_parameter>
	<uxsql_parameter http_post='ts'>2000-01-01 00:00:00.000000</uxsql_parameter>
	<uxsql_parameter name='fields_as_base64'>true</uxsql_parameter>				
</xsql>*/

?>
