<?php
ini_set('display_errors', 1);
include "../php/pg.php";

$pGdbconn = pg_connect($conn_string)  or die("Could not connect");
	$result = pg_query_params($pGdbconn, 'SELECT * FROM fun_view_contacts_phones_with_search_xml($1::text, $2::int[], $3::boolean);', array($_GET['contact_phone_search'], $_GET['exclude_idphones'], true));
$val = pg_fetch_result($result, 0, 0);
echo $val;


/*<xsql>
	<uxsql_query driver='postgres' db_conexion_name='db1' native_xml='true'>SELECT * FROM fun_view_contacts_phones_with_search_xml($1::text, $2::int[], $3::boolean);</uxsql_query>
		<uxsql_parameter http_post='contact_phone_search'></uxsql_parameter>		
		<uxsql_parameter http_post='exclude_idphones'>{}</uxsql_parameter>		
		<uxsql_parameter name='fields_as_base64'>true</uxsql_parameter>	
				
</xsql>*/

?>
