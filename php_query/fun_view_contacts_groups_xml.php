<?php
ini_set('display_errors', 1);
include "../php/pg.php";

$pGdbconn = pg_connect($conn_string)  or die("Could not connect");
	$result = pg_query_params($pGdbconn, 'SELECT * FROM fun_view_contacts_groups_xml($1::integer, $2::boolean);', array($_POST['idcontact'], true));
$val = pg_fetch_result($result, 0, 0);
echo $val;


/*<xsql>
	<uxsql_query driver='postgres' db_conexion_name='db1' native_xml='true'>SELECT * FROM fun_view_contacts_groups_xml($1::integer, $2::boolean);</uxsql_query>
		<uxsql_parameter http_post='idcontact'>0</uxsql_parameter>	
		<uxsql_parameter name='fields_as_base64'>true</uxsql_parameter>	
				
</xsql>*/

?>
