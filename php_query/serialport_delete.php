<?php
ini_set('display_errors', 1);
include "../php/pg.php";

$pGdbconn = pg_connect($conn_string)  or die("Could not connect");
	$result = pg_query_params($pGdbconn, 'DELETE FROM serialport WHERE idport = ?;', array($_GET('idport'), true));
$val = pg_fetch_result($result, 0, 0);
echo $val;


/*<xsql>
	<uxsql_query driver='sqlite' db_name='configuration'>DELETE FROM serialport WHERE idport = ?;</uxsql_query>
		<uxsql_parameter type="text" http_post='idprt'>0</uxsql_parameter>	
		
</xsql>*/

?>
