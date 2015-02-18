<?php
ini_set('display_errors', 1);
include "../php/pg.php";

$pGdbconn = pg_connect($conn_string)  or die("Could not connect");
	$result = pg_query_params($pGdbconn, 'SELECT * FROM fun_contacts_edit_xml($1::integer, $2::boolean, $3::text, $4::text, $5::text, $6::integer, $7::date, $8::integer, $9::text, $10::text, $11::text, $12::text, $13::integer, $14::text, $15::boolean);', array($_POST['idcontact'], $_POST['enable'], $_POST['title'], $_POST['firstname'], $_POST['lastname'], $_POST['gender'], $_POST['birthday'], $_POST['typeofid'], $_POST['identification'], $_POST['web'], $_POST['email1'], $_POST['email2'], $_POST['idaddress'], $_POST['note'], true));
$val = pg_fetch_result($result, 0, 0);
echo $val;


/*<xsql>
	<uxsql_query driver='postgres' db_conexion_name='db1' native_xml='true'>SELECT * FROM fun_contacts_edit_xml($1::integer, $2::boolean, $3::text, $4::text, $5::text, $6::integer, $7::date, $8::integer, $9::text, $10::text, $11::text, $12::text, $13::integer, $14::text, $15::boolean);</uxsql_query>
		<uxsql_parameter http_post='idcontact'>0</uxsql_parameter>
		<uxsql_parameter http_post='enable'>false</uxsql_parameter>
		<uxsql_parameter http_post='title'>N/A</uxsql_parameter>
		<uxsql_parameter http_post='firstname'> </uxsql_parameter>
		<uxsql_parameter http_post='lastname'> </uxsql_parameter>
		<uxsql_parameter http_post='gender'></uxsql_parameter>
		<uxsql_parameter http_post='birthday'></uxsql_parameter>
		<uxsql_parameter http_post='typeofid'></uxsql_parameter>
		<uxsql_parameter http_post='identification'></uxsql_parameter>
		<uxsql_parameter http_post='web'></uxsql_parameter>
		<uxsql_parameter http_post='email1'></uxsql_parameter>
		<uxsql_parameter http_post='email2'></uxsql_parameter>
		<uxsql_parameter http_post='idaddress'>0</uxsql_parameter>
		<uxsql_parameter http_post='note'></uxsql_parameter>
		<uxsql_parameter name='fields_as_base64'>true</uxsql_parameter>		
</xsql>*/

?>
