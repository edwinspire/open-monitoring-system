<?php
ini_set('display_errors', 1);
include "../php/pg.php";

$pGdbconn = pg_connect($conn_string)  or die("Could not connect");
	$result = pg_query_params($pGdbconn, 'SELECT * FROM fun_view_incomingcalls_xml($1::timestamp without time zone, $2::timestamp without time zone, $3::boolean);', array($_GET('datestart'), $_GET('dateend'), true));
$val = pg_fetch_result($result, 0, 0);
echo $val;


/*<xsql>
	<uxsql_query driver='postgres' db_conexion_name='db1' native_xml='true'>SELECT * FROM fun_view_incomingcalls_xml($1::timestamp without time zone, $2::timestamp without time zone, $3::boolean);</uxsql_query>
		<uxsql_parameter http_get='datestart'></uxsql_parameter>
		<uxsql_parameter http_get='dateend'></uxsql_parameter>
		<uxsql_parameter name='fields_as_base64'>true</uxsql_parameter>			
		
</xsql>*/

?>
