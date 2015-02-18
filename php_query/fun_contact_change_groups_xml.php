<?php
ini_set('display_errors', 1);
include "../php/pg.php";

$pGdbconn = pg_connect($conn_string)  or die("Could not connect");
	$result = pg_query_params($pGdbconn, 'SELECT * FROM fun_contact_change_groups_xml($1::integer, $2::integer, $3::boolean, $4::boolean);', array($_POST['idcontact'], $_POST['idgroup'], $_POST['belong'], true));
$val = pg_fetch_result($result, 0, 0);
echo $val;


/*<xsql>
	<uxsql_query driver='postgres' db_conexion_name='db1' native_xml='true'>SELECT * FROM fun_contact_change_groups_xml($1::integer, $2::integer, $3::boolean, $4::boolean);</uxsql_query>
		<uxsql_parameter http_post='idcontact'></uxsql_parameter>	
		<uxsql_parameter http_post='idgroup'></uxsql_parameter>	
		<uxsql_parameter http_post='belong'></uxsql_parameter>
		<uxsql_parameter name='fields_as_base64'>true</uxsql_parameter>	
				
</xsql>*/

?>
