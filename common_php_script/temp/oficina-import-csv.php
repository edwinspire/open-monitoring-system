<?php

//ini_set('display_errors', 1);
include "pg_conn_string.php";
include "import_ipserver_from_sqlserver_to_postgres.php";

//$row = 1;

/* server_159.fun_oficina_insert_update(icompania text, isucursal text, ioficina text, inombre text, idireccion1 text, idireccion2 text, itelefono1 text, itelefono2 text, icorreo_electronico text, iestado text, iip_server text, ies_franquicia boolean, ienvio_pos "char", inombre_db text, iusuario_db text, iclave_db text, imaneja_1800 boolean, ipaf "char", ilista_principal text)
  RETURNS text AS */


$link = mssql_connect('192.168.238.159', 'sa', 'sqlfarma');

if (!$link)
    die('Unable to connect!');

if (!mssql_select_db('EasyGestionEmpresarial', $link))
    die('Unable to select database!');

$resultms = mssql_query("select * FROM [EasyGestionEmpresarial].[dbo].[Oficina] WHERE estado = 'A' ORDER BY Oficina");

$pGdbconn = pg_connect($conn_string) or die("Could not connect postgres server");

while ($data = mssql_fetch_array($resultms)) {

    print_r($data);
    $resultpg = pg_query_params($pGdbconn, 'SELECT server_159.fun_oficina_insert_update($1::text, $2::text, $3::text, $4::text, $4::text, $6::text, $7::text, $8::text, $9::text, $10::text, $11::text, $12::boolean, $13::"char", $14::text, $15::text, $16::text, $17::boolean, $18::"char", $19::text, $20::timestamp without time zone, $21::timestamp without time zone);', array(
        utf8_encode($data['Compania']),
        utf8_encode($data['Sucursal']),
        utf8_encode($data['Oficina']),
        utf8_encode($data['Nombre']),
        utf8_encode($data['Direccion1']),
        utf8_encode($data['Direccion2']),
        utf8_encode($data['Telefono1']),
        utf8_encode($data['Telefono2']),
        utf8_encode($data['correo_electronico']),
        utf8_encode($data['estado']),
        utf8_encode($data['IP_Server']),
        $data['es_franquicia'],
        $data['ENVIO_POS'],
        utf8_encode($data['NombreDB']),
        utf8_encode($data['UsuarioDB']),
        utf8_encode($data['ClaveDB']),
        $data['Maneja1800'],
        $data['PAF'],
        utf8_encode($data['Lista_Principal']), $data['fecha_apertura'], $data['fecha_cierre']));
}

mssql_free_result($resultms);


/*
  if (($handle = fopen("D:/sqlserver-csv/gestionempresarial-oficina.csv", "r")) !== FALSE) {

  $pGdbconn = pg_connect($conn_string)  or die("Could not connect");

  echo  'Importando datos Oficina desde archvo CSV <br/>';

  while (($data = fgetcsv($handle, 0, ";")) !== FALSE) {



  $result = pg_query_params($pGdbconn, 'SELECT fun_oficina_importar_csv($1::text,
  $2::text,
  $3::text,
  $4::text,
  $5::text,
  $6::text,
  $7::text,
  $8::text,
  $9::text,
  $10::text,
  $11::text);', array($data[0], $data[1], $data[2], $data[3], $data[4], $data[5], $data[6], $data[7], $data[8], $data[9], $data[10]));
  $val = pg_fetch_result($result, 0, 0);
  echo  'Registro '.$val.' importado<br/>';


  }
  fclose($handle);
  }


  include "oficina_ipserver-csv.php";

 */
?> 
