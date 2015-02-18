<?php
//ini_set('display_errors', 0);
include "../php/pg.php";

$pGdbconn = pg_connect($conn_string)  or die("Could not connect");
	$result = pg_query_params($pGdbconn, 'SELECT * FROM fun_groups_edit_xml($1::integer, $2::boolean, $3::text, $4::text, $5::timestamp without time zone, $6::boolean);', array($_POST['idgroup'], $_POST['enable'], $_POST['name'], $_POST['note'], '2000-01-01 00:00', true));
$val = pg_fetch_result($result, 0, 0);
echo $val;


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
