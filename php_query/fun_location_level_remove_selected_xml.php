<?php
ini_set('display_errors', 1);
include "../php/pg.php";

$pGdbconn = pg_connect($conn_string)  or die("Could not connect");
	$result = pg_query_params($pGdbconn, 'SELECT * FROM fun_location_level_remove_selected_xml($1::integer, $2::integer[], $3::boolean);', array($_POST['level'], $_POST['idpk'], true));
$val = pg_fetch_result($result, 0, 0);
echo $val;


/*<xsql>
	<uxsql_query driver='postgres' db_conexion_name='db1' native_xml='true'>SELECT * FROM fun_location_level_remove_selected_xml($1::integer, $2::integer[], $3::boolean);</uxsql_query>
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
