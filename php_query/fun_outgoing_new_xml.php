<?php
ini_set('display_errors', 1);
include "../php/pg.php";

$pGdbconn = pg_connect($conn_string)  or die("Could not connect");
	$result = pg_query_params($pGdbconn, 'SELECT fun_outgoing_new_xml($1::integer, $2::integer, $3::integer, $4::integer, $5::text, $6::text, $7::timestamp without time zone, $8::integer, $9::boolean, $10::boolean, $11::integer, $12::integer, $13::text, $14::boolean);', array($_POST['idprovider'], $_POST['idsim'], $_POST['idsmstype'], $_POST['idphone'], $_POST['phone'], $_POST['message'], $_POST['date'], $_POST['priority'], $_POST['report'], $_POST['enablemsgclass'], $_POST['msgclass'], $_POST['idowner'], $_POST['note'], true));
$val = pg_fetch_result($result, 0, 0);
echo $val;


/*<xsql>
	<uxsql_query driver='postgres' db_conexion_name='db1' native_xml='true'>SELECT fun_outgoing_new_xml($1::integer, $2::integer, $3::integer, $4::integer, $5::text, $6::text, $7::timestamp without time zone, $8::integer, $9::boolean, $10::boolean, $11::integer, $12::integer, $13::text, $14::boolean);</uxsql_query>
		<uxsql_parameter http_post='idprovider'>0</uxsql_parameter>		
		<uxsql_parameter http_post='idsim'>0</uxsql_parameter>
		<uxsql_parameter http_post='idsmstype'>0</uxsql_parameter>
		<uxsql_parameter http_post='idphone'>0</uxsql_parameter>
		<uxsql_parameter http_post='phone'></uxsql_parameter>
		<uxsql_parameter http_post='message'></uxsql_parameter>
		<uxsql_parameter http_post='date'>0</uxsql_parameter>
		<uxsql_parameter http_post='priority'>0</uxsql_parameter>
		<uxsql_parameter http_post='report'>0</uxsql_parameter>
		<uxsql_parameter http_post='enablemsgclass'>0</uxsql_parameter>
		<uxsql_parameter http_post='msgclass'>0</uxsql_parameter>
		<uxsql_parameter http_post='idowner'>0</uxsql_parameter>
		<uxsql_parameter http_post='note'></uxsql_parameter>		
		<uxsql_parameter name='fields_as_base64'>true</uxsql_parameter>	
				
</xsql>*/

?>
