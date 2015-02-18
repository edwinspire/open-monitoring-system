<?php
ini_set('display_errors', 1);
include "../php/pg.php";

$pGdbconn = pg_connect($conn_string)  or die("Could not connect");
	$result = pg_query_params($pGdbconn, 'SELECT * FROM usaga.fun_event_comment_insert_xml($1::integer, $2::integer, $3::integer, $4::integer, $5::text, $6::integer[], $7::boolean);', array($_POST('idevent'), $_POST('idadmin'), $_POST('seconds'), $_POST('status'), $_POST('comment'), $_POST('idattachs'),  true));
$val = pg_fetch_result($result, 0, 0);
echo $val;


/*<xsql>
	<uxsql_query driver='postgres' db_conexion_name='db1' native_xml='true'>SELECT * FROM usaga.fun_event_comment_insert_xml($1::integer, $2::integer, $3::integer, $4::integer, $5::text, $6::integer[], $7::boolean);</uxsql_query>
		<uxsql_parameter http_post='idevent'>0</uxsql_parameter>		
		<uxsql_parameter http_post='idadmin'>0</uxsql_parameter>		
		<uxsql_parameter http_post='seconds'>0</uxsql_parameter>		
		<uxsql_parameter http_post='status'>0</uxsql_parameter>		
		<uxsql_parameter http_post='comment'>0</uxsql_parameter>		
		<uxsql_parameter http_post='idattachs'>{}</uxsql_parameter>		
		<uxsql_parameter name='fields_as_base64'>true</uxsql_parameter>	
				
</xsql>*/

?>
