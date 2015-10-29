<?php

ini_set('mssql.charset', 'UTF-8');
include "pg_conn_string.php";

$link3_tec = mssql_connect('192.168.238.159', 'sa', 'sqlfarma');

if (!$link3_tec)
    die('Unable to connect!');

if (!mssql_select_db('EasyGestionEmpresarial', $link3_tec))
    die('Unable to select row_tec_3base!');

$resultms = mssql_query("select * from [EasyGestionEmpresarial].[dbo].[SP_PAR_Tecnicos]");

$pGdbconn3_tec = pg_connect($conn_string) or die("Could not connect postgres server");

while ($row_tec_3 = mssql_fetch_array($resultms)) {

//print_r ($row_tec_3);
    $resultpg = pg_query_params($pGdbconn3_tec, 'SELECT server_159.fun_personal_tecnico_insertar_actualizar($1::text, $2::text, $3::text, $4::text);', array(utf8_encode($row_tec_3['tec_cedula']), utf8_encode($row_tec_3['tec_nombre']), utf8_encode($row_tec_3['tec_apellido']), utf8_encode($row_tec_3['tec_tipo'])));
}

mssql_free_result($resultms);
?> 
