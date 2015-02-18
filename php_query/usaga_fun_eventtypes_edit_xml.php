<?php
ini_set('display_errors', 1);
include "../php/pg.php";

$pGdbconn = pg_connect($conn_string)  or die("Could not connect");
	$result = pg_query_params($pGdbconn, 'SELECT * FROM  usaga.fun_eventtypes_edit_xml($1::integer, $2::integer, $3::text, $4::boolean, $5::boolean, $6::boolean, $7::boolean, $8::boolean, $9::integer, $10::boolean, $11::text, $12::text, $13::text, $14::timestamp without time zone, $15::boolean);', array($_POST('ideventtype'), $_POST('priority'), $_POST('label'), $_POST('accountdefault'), $_POST('groupdefault'), $_POST('manual'), $_POST('treatment'), $_POST('enable_datetime'), $_POST('na_timeout'), $_POST('na_closable'), $_POST('na_img'), $_POST('na_snd'), $_POST('note'), $_POST('ts'), true));
$val = pg_fetch_result($result, 0, 0);
echo $val;


/*<xsql>
	<uxsql_query driver='postgres' db_conexion_name='db1' native_xml='true'>SELECT * FROM  usaga.fun_eventtypes_edit_xml($1::integer, $2::integer, $3::text, $4::boolean, $5::boolean, $6::boolean, $7::boolean, $8::boolean, $9::integer, $10::boolean, $11::text, $12::text, $13::text, $14::timestamp without time zone, $15::boolean);</uxsql_query>
	<uxsql_parameter http_post='ideventtype'>0</uxsql_parameter>
	<uxsql_parameter http_post='priority'>100</uxsql_parameter>
	<uxsql_parameter http_post='label'></uxsql_parameter>
	<uxsql_parameter http_post='accountdefault'>false</uxsql_parameter>
	<uxsql_parameter http_post='groupdefault'>false</uxsql_parameter>
	<uxsql_parameter http_post='manual'>false</uxsql_parameter>
	<uxsql_parameter http_post='treatment'>false</uxsql_parameter>
	<uxsql_parameter http_post='enable_datetime'>false</uxsql_parameter>
	<uxsql_parameter http_post='na_timeout'>10</uxsql_parameter>
	<uxsql_parameter http_post='na_closable'>false</uxsql_parameter>
	<uxsql_parameter http_post='na_img'></uxsql_parameter>
	<uxsql_parameter http_post='na_snd'></uxsql_parameter>
	<uxsql_parameter http_post='note'></uxsql_parameter>
	<uxsql_parameter http_post='ts'>2000-01-01 00:00:00.000000</uxsql_parameter>
		<uxsql_parameter name='fields_as_base64'>true</uxsql_parameter>	
				
</xsql>*/

?>
