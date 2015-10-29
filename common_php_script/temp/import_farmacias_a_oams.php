<?php

//ini_set('display_errors', 1);
include "pg_conn_string_oams.php";

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
    echo "Oficina " . $row_ofic1['Oficina'] . "\n\r";
// fun_create_account(IN iidaccountstate integer, IN iidaccounttype integer, IN iaccount text, IN ifirst_name text, IN ilast_name text, IN iidentification text, IN iididtype integer, OUT fun_return integer, OUT fun_msg text)

    $resultpg = pg_query_params($pGdbconn1_ofic, 'SELECT fun_quick_create_account($1::integer, $2::integer, $3::text, $4::text, $5::text, $6::text, $7::integer, $8::text , $9::text);', array("1", "1",
        utf8_encode($row_ofic1['Oficina']),
        utf8_encode($row_ofic1['Sucursal']),
        utf8_encode($row_ofic1['Nombre']),
        utf8_encode($row_ofic1['Oficina']),
        "3",
        utf8_encode($row_ofic1['Direccion1']),
        utf8_encode($row_ofic1['Direccion2'])
            )
    );
}

mssql_free_result($resultms1_ofic);
?> 
