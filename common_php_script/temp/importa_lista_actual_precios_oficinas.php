<?php

include "pg_conn_string.php";
error_reporting(0);

$pGdbconn_get_lista_ip_servers = pg_connect($conn_string) or die("Could not connect");
$result = pg_prepare($pGdbconn_get_lista_ip_servers, "my_query", 'SELECT fun_lista_precios_actuales_insert_update($1::text, $2::text, $3::text, $4::integer);');

$result_dato_acceso_servers1 = pg_query_params($pGdbconn_get_lista_ip_servers, "SELECT oficina, ip_server_farmacia, nombre_db, usuario_db, clave_db FROM server_159.oficina WHERE estado = 'A'", array());

while ($row_dato_acceso_servers1 = pg_fetch_array($result_dato_acceso_servers1)) {
//print_r ($row_dato_acceso_servers1);

    $datos_precios = obtiene_lista_precios_actual_desde_oficina($row_dato_acceso_servers1['oficina'], $row_dato_acceso_servers1['ip_server_farmacia'], $row_dato_acceso_servers1['usuario_db'], $row_dato_acceso_servers1['clave_db']);
//break;
// Execute the prepared query.  Note that it is not necessary to escape
// the string "Joe's Widgets" in any way
    $result = pg_execute($pGdbconn_get_lista_ip_servers, "my_query", array($datos_precios["oficina"], $datos_precios["lista_precios_principal"], $datos_precios["lista_precios_activa"], $datos_precios["cantidad_productos_lista"]));
//break;
}

function obtiene_lista_precios_actual_desde_oficina($oficina, $ip, $user, $pwd) {

    $lista_precios_principal = "** FAIL **";
    $lista_precios_activa = "** FAIL **";
    $cantidad_productos_lista = 0;


    /*
      use easygestionempresarial
      go
      select lista_principal,oficina,nombre,* from oficina
      where oficina = ('xzc')

      select * from pv_lista_precio_oficina
      where oficina = ('xzc') and estado = 'activo'

      select count(*) from tbl_precios_sucursales where sucursal = 'LP-20'
     */

    if ($ip) {

        $link_oficina = mssql_connect($ip, $user, $pwd);

        if ($link_oficina) {
            if (mssql_select_db('EasyGestionEmpresarial', $link_oficina)) {
                //die('Unable to select row_asing_tec_1base!');

                $lista_precios_principal = mssql_fetch_array(mssql_query("SELECT lista_principal FROM oficina WHERE oficina = ('" . $oficina . "')"))[0];
                $lista_precios_activa = mssql_fetch_array(mssql_query("SELECT lista_precio from pv_lista_precio_oficina WHERE oficina = ('" . $oficina . "') AND estado = 'activo'"))[0];
                $cantidad_productos_lista = mssql_fetch_array(mssql_query("SELECT COUNT(*) FROM tbl_precios_sucursales WHERE sucursal = '" . $lista_precios_activa . "'"))[0];

//echo $oficina." - ".$cantidad_productos_lista."\n";
            }
        } else {
            echo('Unable to connect!' . $oficina . "\n\r");
        }
    }

    return array("oficina" => $oficina, "lista_precios_principal" => $lista_precios_principal, "lista_precios_activa" => $lista_precios_activa, "cantidad_productos_lista" => $cantidad_productos_lista);
}

?>
