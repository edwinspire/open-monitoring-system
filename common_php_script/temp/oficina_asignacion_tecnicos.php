<?php

//ini_set('display_errors', 1);
include "pg_conn_string.php";
//$row = 1;



$link2_ms_tecnicos = mssql_connect('192.168.238.159', 'sa', 'sqlfarma');

if (!$link2_ms_tecnicos)
    die('Unable to connect!');

if (!mssql_select_db('EasyGestionEmpresarial', $link2_ms_tecnicos))
    die('Unable to select row_asing_tec_1base!');

$resultms2 = mssql_query("select * from [EasyGestionEmpresarial].[dbo].[SP_PAR_AsignacionFarmacias]");

$pGdbconn_asing_tec_1 = pg_connect($conn_string) or die("Could not connect postgres server");

while ($row_asing_tec_1 = mssql_fetch_array($resultms2)) {

//print_r ($row_asing_tec_1);
    $resultpg = pg_query_params($pGdbconn_asing_tec_1, 'SELECT server_159.fun_personal_tecnico_update_asignaciones_oficina($1::text, $2::text);', array($row_asing_tec_1['af_cedula'], $row_asing_tec_1['af_idoficina']));
}

mssql_free_result($resultms2);








/*
  if (($handle = fopen("D:/sqlserver-csv/oficina_asignacion_tecnicos.csv", "r")) !== FALSE) {

  $pGdbconn_asing_tec_1 = pg_connect($conn_string)  or die("Could not connect");

  echo  'Actualizando asignacion de oficinas a tecnicos <br/>';

  while (($row_asing_tec_1 = fgetcsv($handle, 512, ";")) !== FALSE) {

  // fun_personal_tecnico_importar_csv(    itec_cedula text,    itec_nombre text,    itec_apellido text,    itec_tipo text)
  $result = pg_query_params($pGdbconn_asing_tec_1, 'SELECT server_159.fun_personal_tecnico_update_asignaciones_oficina($1::text, $2::text);', array($row_asing_tec_1[0], $row_asing_tec_1[1]));
  $val = pg_fetch_result($result, 0, 0);

  echo  'Actualizacion devuelve '.$val.'<br/>';

  }
  fclose($handle);
  } */
?>
