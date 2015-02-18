<?php
// Report all PHP errors
ini_set('display_errors', 1);
include "../php/pg.php";

echo 'Hola mundo cruel';
echo $mama;
$result = pg_query_params($pGdbconn, 'SELECT usaga.fun_event_comment_insert_xml($1::integer, $2::integer, $3::integer, $4::integer, $5::text, $6::integer[], $7::boolean);', array($_uHTTP_POST['idevent'], $_uHTTP_POST['idadmin'], $_uHTTP_POST['seconds'], $_uHTTP_POST['status'], $_uHTTP_POST['comment'], "{}", true));
$val = pg_fetch_result($result, 0, 0);

echo $result;
echo $val;


/*<xsql>
	<uxsql_query driver='postgres' db_conexion_name='db1' native_xml='true'>SELECT * FROM fun_view_locations_ids_from_idlocation_xml($1::integer);</uxsql_query>
		<uxsql_parameter http_get='idlocation'></uxsql_parameter>
				
</xsql>*/

?>
