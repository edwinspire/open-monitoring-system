<?php

//ini_set('display_errors', 1);
include "pg_conn_string.php";

//$row = 1;

/* server_159.fun_oficina_insert_update(icompania text, isucursal text, ioficina text, inombre text, idireccion1 text, idireccion2 text, itelefono1 text, itelefono2 text, icorreo_electronico text, iestado text, iip_server text, ies_franquicia boolean, ienvio_pos "char", inombre_db text, iusuario_db text, iclave_db text, imaneja_1800 boolean, ipaf "char", ilista_principal text)
  RETURNS text AS */


$link1_oficx1 = mssql_connect('192.168.238.159', 'sa', 'sqlfarma');

if (!$link1_oficx1)
    die('Unable to connect!');

if (!mssql_select_db('EasyGestionEmpresarial', $link1_oficx1))
    die('Unable to select row_ofic1base!');

$resultms1_ofic = mssql_query("select CONVERT(VARCHAR(19), oficina.fecha_apertura, 120) as f_apertura, CONVERT(VARCHAR(19), oficina.fecha_cierre, 120) as f_cierre, * FROM [EasyGestionEmpresarial].[dbo].[Oficina]");

$pGdbconn1_ofic = pg_connect($conn_string) or die("Could not connect postgres server");

while ($row_ofic1 = mssql_fetch_array($resultms1_ofic)) {

//print_r ($row_ofic1);

    $es_franquicia = "false";

    if ($row_ofic1['es_franquicia'] == "S") {
        $es_franquicia = "true";
    }

    $Maneja1800 = "true";
    if ($row_ofic1['Maneja1800'] == "NO") {
        $Maneja1800 = "false";
    }

//echo $row_ofic1['Maneja1800']." => ".$Maneja1800."\n\r";
    /* server_159.fun_oficina_insert_update(
      $1::text,
      $2::text,
      $3::text,
      $4::text,
      $5::text,
      $6::text,
      $7::text,
      $8::text,
      $9::text,
      $10::text,
      $11::text,
      $12::boolean,
      $13::"char",
      $14::text,
      $15::text,
      $16::text,
      $17::boolean,
      $18::"char",
      $19::text,
      $20::timestamp without time zone,
      $21::timestamp without time zone)

     */

    $resultpg = pg_query_params($pGdbconn1_ofic, 'SELECT server_159.fun_oficina_insert_update($1::text, $2::text, $3::text, $4::text, $5::text, $6::text, $7::text, $8::text, $9::text, $10::text, $11::text, $12::boolean, $13::"char", $14::text, $15::text, $16::text, $17::boolean, $18::"char", $19::text, $20::timestamp without time zone, $21::timestamp without time zone);', array(
        utf8_encode($row_ofic1['Compania']),
        utf8_encode($row_ofic1['Sucursal']),
        utf8_encode($row_ofic1['Oficina']),
        utf8_encode($row_ofic1['Nombre']),
        utf8_encode($row_ofic1['Direccion1']),
        utf8_encode($row_ofic1['Direccion2']),
        utf8_encode($row_ofic1['Telefono1']),
        utf8_encode($row_ofic1['Telefono2']),
        utf8_encode($row_ofic1['correo_electronico']),
        utf8_encode($row_ofic1['estado']),
        utf8_encode($row_ofic1['IP_Server']),
        $es_franquicia,
        $row_ofic1['ENVIO_POS'],
        utf8_encode($row_ofic1['NombreBD']),
        utf8_encode($row_ofic1['UsuarioBD']),
        utf8_encode($row_ofic1['ClaveBD']),
        $Maneja1800,
        $row_ofic1['PAF'],
        utf8_encode($row_ofic1['Lista_Principal']),
        $row_ofic1['f_apertura'],
        $row_ofic1['f_cierre'])
    );
}

mssql_free_result($resultms1_ofic);


// Luego de esto se debe actualizar las IP de los servidores de las farmacias
include "update_ipserver_into_oficina_from_sqlserver_to_postgres.php";

// Actualizamos la lista de tecnicos
include "import_tecnicos_frommssql_to_postgres.php";

// Luego actualizamos la asignacion de tecnicos a cada farmacia
include "oficina_asignacion_tecnicos.php";
?> 
