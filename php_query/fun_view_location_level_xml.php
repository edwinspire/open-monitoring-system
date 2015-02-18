<?php
include "../php/pg.php";

if (isset($_uHTTP_POST['idevent'])) {
	$result = pg_query_params($pGdbconn, 'SELECT usaga.fun_event_comment_insert_xml($1::integer, $2::integer, $3::integer, $4::integer, $5::text, $6::integer[], $7::boolean);', array($_uHTTP_POST['idevent'], $_uHTTP_POST['idadmin'], $_uHTTP_POST['seconds'], $_uHTTP_POST['status'], $_uHTTP_POST['comment'], "{}", true));
$val = pg_fetch_result($result, 0, 0);
echo $val;
}else{
echo "<table></table>";
}

/*
<xsql>
	<uxsql_query driver='postgres' db_conexion_name='db1' native_xml='true'>SELECT * FROM fun_view_location_level_xml($1::integer, $2::integer, $3::boolean);</uxsql_query>
			<uxsql_parameter http_get='level'>0</uxsql_parameter>	
		<uxsql_parameter http_get='idfk'>0</uxsql_parameter>
		<uxsql_parameter name='fields_as_base64'>true</uxsql_parameter>	
		
</xsql>*/


?>
