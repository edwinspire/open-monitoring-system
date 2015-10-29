<?php

ini_set('mssql.charset', 'UTF-8');
include "pg_conn_string.php";
// Este script se lo reemplaza por uno que actualice los datos de la IP en la tabla oficina del server_159 para no tener otra tabla con mas datos.

$link = mssql_connect('192.168.238.10', 'sa', 'sql');

if (!$link)
    die('Unable to connect!');

if (!mssql_select_db('bdgeneral', $link))
    die('Unable to select database!');

$resultms = mssql_query("select * FROM [bdgeneral].[dbo].[OFICINA_IP_SERVER]");

$pGdbconn_ip_server = pg_connect($conn_string) or die("Could not connect postgres server");

while ($data = mssql_fetch_array($resultms)) {

//print_r ($data);
    $resultpg = pg_query_params($pGdbconn_ip_server, 'SELECT server_159.fun_ip_server_update($1::text, $2::text, $3::"char", $4::integer);', array(utf8_encode($data['oficina']), utf8_encode($data['ip_red']), $data['ENVIO_POS'], $data['migrada']));
}

mssql_free_result($resultms);
?> 
