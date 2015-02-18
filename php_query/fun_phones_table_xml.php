<?php
ini_set('display_errors', 1);
include "../php/pg.php";

$pGdbconn = pg_connect($conn_string)  or die("Could not connect");
	$result = pg_query_params($pGdbconn, 'SELECT * FROM fun_phones_table_xml($1::integer, $2::integer, $3::boolean, $4::text, $5::integer, $6::integer, $7::text, $8::integer, $9::integer, $10::text, $11::timestamp without time zone, $12::boolean);', array($_POST['idphone'], $_POST['idcontact'], $_POST['enable'], $_POST['phone'], $_POST['typephone'], $_POST['idprovider'], $_POST['phone_ext'], $_POST['idaddress'], $_POST['ubiphone'], $_POST['note'], $_POST['ts'], 'true'));
$val = pg_fetch_result($result, 0, 0);
echo $val;


/*<xsql>
	<uxsql_query driver='postgres' db_conexion_name='db1' native_xml='true'>SELECT * FROM fun_phones_table_xml($1::integer, $2::integer, $3::boolean, $4::text, $5::integer, $6::integer, $7::text, $8::integer, $9::integer, $10::text, $11::timestamp without time zone, $12::boolean);</uxsql_query>

		<uxsql_parameter http_post='idphone'>0</uxsql_parameter>
		<uxsql_parameter http_post='idcontact'>0</uxsql_parameter>
		<uxsql_parameter http_post='enable'></uxsql_parameter>
		<uxsql_parameter http_post='phone'></uxsql_parameter>
		<uxsql_parameter http_post='typephone'></uxsql_parameter>
		<uxsql_parameter http_post='idprovider'></uxsql_parameter>
		<uxsql_parameter http_post='phone_ext'></uxsql_parameter>
		<uxsql_parameter http_post='idaddress'></uxsql_parameter>
		<uxsql_parameter http_post='ubiphone'></uxsql_parameter>
		<uxsql_parameter http_post='note'></uxsql_parameter>
		<uxsql_parameter http_post='ts'></uxsql_parameter>
		<uxsql_parameter name='fields_as_base64'>true</uxsql_parameter>			
		
</xsql>*/

?>
