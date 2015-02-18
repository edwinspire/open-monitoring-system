<?php
ini_set('display_errors', 1);
include "../php/pg.php";

$pGdbconn = pg_connect($conn_string)  or die("Could not connect");
	$result = pg_query_params($pGdbconn, 'SELECT * FROM fun_sim_table_edit_xml($1::integer, $2::integer, $3::boolean, $4::boolean, $5::text, $6::boolean, $7::integer, $8::integer, $9::boolean, $10::integer, $11::integer, $12::integer, $13::text, $14::boolean);', array($_POST['idsim'], $_POST['idprovider'], $_POST['enable'], $_POST['enable_sendsms'], $_POST['phone'], $_POST['smsout_request_reports'], $_POST['smsout_retryonfail'], $_POST['smsout_max_length'], $_POST['smsout_enabled_other_providers'], $_POST['on_incommingcall'], $_POST['dtmf_tone'], $_POST['dtmf_tone_time'], true));
$val = pg_fetch_result($result, 0, 0);
echo $val;


/*<xsql>
	<uxsql_query driver='postgres' db_conexion_name='db1' native_xml='true'>SELECT * FROM fun_sim_table_edit_xml($1::integer, $2::integer, $3::boolean, $4::boolean, $5::text, $6::boolean, $7::integer, $8::integer, $9::boolean, $10::integer, $11::integer, $12::integer, $13::text, $14::boolean);</uxsql_query>
		<uxsql_parameter http_post='idsim'>0</uxsql_parameter>		
		<uxsql_parameter http_post='idprovider'>0</uxsql_parameter>		
		<uxsql_parameter http_post='enable'></uxsql_parameter>		
		<uxsql_parameter http_post='enable_sendsms'></uxsql_parameter>		
		<uxsql_parameter http_post='phone'></uxsql_parameter>		
		<uxsql_parameter http_post='smsout_request_reports'></uxsql_parameter>		
		<uxsql_parameter http_post='smsout_retryonfail'></uxsql_parameter>		
		<uxsql_parameter http_post='smsout_max_length'></uxsql_parameter>		
		<uxsql_parameter http_post='smsout_enabled_other_providers'></uxsql_parameter>		
		<uxsql_parameter http_post='on_incommingcall'></uxsql_parameter>		
		<uxsql_parameter http_post='dtmf_tone'></uxsql_parameter>		
		<uxsql_parameter http_post='dtmf_tone_time'></uxsql_parameter>		
		<uxsql_parameter http_post='note'></uxsql_parameter>			
		<uxsql_parameter name='fields_as_base64'>true</uxsql_parameter>				
</xsql>*/

?>
