<?php

ini_set('mssql.charset', 'UTF-8');
include "pg_conn_string.php";
// Este script se lo reemplaza por uno que actualice los datos de la IP en la tabla oficina del server_159 para no tener otra tabla con mas datos.

$linkms1 = mssql_connect('192.168.238.10', 'sa', 'sql');

if (!$linkms1)
    die('Unable to connect!');

if (!mssql_select_db('bdgeneral', $linkms1))
    die('Unable to select row_ip_red_1base!');

$resultms1 = mssql_query("select * FROM [bdgeneral].[dbo].[OFICINA_IP_SERVER]");

$pGdbconn_ip_server = pg_connect($conn_string) or die("Could not connect postgres server");

while ($row_ip_red_1 = mssql_fetch_array($resultms1)) {

    print_r($row_ip_red_1);
    $resultpg = pg_query_params($pGdbconn_ip_server, 'SELECT server_10.fun_ip_server_insert_update($1::text, $2::text, $3::"char", $4::integer);', array(utf8_encode($row_ip_red_1['oficina']), utf8_encode($row_ip_red_1['ip_red']), $row_ip_red_1['ENVIO_POS'], $row_ip_red_1['migrada']));
}

mssql_free_result($resultms1);
?> 
