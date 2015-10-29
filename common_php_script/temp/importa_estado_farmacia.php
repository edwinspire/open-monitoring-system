<?php

include "pg_conn_string.php";
include "ping_servidor_enlace.php";
//error_reporting(0);

$pGdbconn_get_lista_ip_servers = pg_connect($conn_string) or die("Could not connect");
/*
  fun_farmacias_advertencias_insert_update(ioficina text,
  ijobs boolean,
  idb_status boolean,
  idb_size double precision, -- En Gigas
  idb_log_size double precision,
  ilista_principal text,
  ilista_activa text,
  iproductos integer,
  ienlace boolean,
  iservidor boolean
 */
$result = pg_prepare($pGdbconn_get_lista_ip_servers, "my_query", 'SELECT fun_farmacias_estado_general_insert_update($1::text,
  $2::integer,
  $3::integer,
  $4::double precision, 
  $5::double precision,
  $6::text,
  $7::text,
  $8::integer,
  $9::boolean,
  $10::boolean);');

$result_dato_acceso_servers1 = pg_query_params($pGdbconn_get_lista_ip_servers, "SELECT oficina, ip_server_farmacia, nombre_db, usuario_db, clave_db FROM server_159.oficina WHERE estado = 'A' AND enabled = true;", array());

while ($row_dato_acceso_servers1 = pg_fetch_array($result_dato_acceso_servers1)) {

    $oficina = $row_dato_acceso_servers1["oficina"];
    $ip = $row_dato_acceso_servers1["ip_server_farmacia"];

    echo("[Oficina " . $oficina . " con IP " . $ip . " Analizando]\n\r");

    $retorno["oficina"] = $oficina;
    $retorno["enlace"] = "false";
    $retorno["servidor"] = "false";
    $retorno["jobs"] = "999";
    $retorno["db_status"] = "999";
    $retorno["db_size"] = "-1";
    $retorno["db_log_size"] = "-1";
    $retorno["lista_activa"] = "*";
    $retorno["lista_principal"] = "*";
    $retorno["productos"] = "-1";

    if (Net_CheckIP::check_ip($ip)) {

        $link_oficina = mssql_connect($ip, $row_dato_acceso_servers1['usuario_db'], $row_dato_acceso_servers1['clave_db']);

        if ($link_oficina) {

            $retorno["enlace"] = "true";
            $retorno["servidor"] = "true";
            $retorno = array_merge($retorno, obtiene_estado_db($oficina, $link_oficina), obtiene_lista_precios($oficina, $link_oficina));
        } else {
            echo("Oficina " . $oficina . " con IP " . $ip . " no conecta con MSSQL\n\r");
            $retorno["servidor"] = ping_server($ip);
            $retorno["enlace"] = ping_enlace($ip);
        }
    } else {
        echo("Oficina " . $oficina . " con IP " . $ip . " invalida\n\r");
        $retorno["enlace"] = "false";
        $retorno["servidor"] = "false";
    }

//print_r($retorno);
    pg_execute($pGdbconn_get_lista_ip_servers, "my_query", array($retorno["oficina"], $retorno["jobs"], $retorno["db_status"], $retorno["db_size"], $retorno["db_log_size"], $retorno["lista_principal"], $retorno["lista_activa"], $retorno["productos"], $retorno["enlace"], $retorno["servidor"]));
}

function obtiene_estado_db($oficina, $link_mssql) {

    $retorno["jobs"] = "999";
    $retorno["db_status"] = "999";
    $retorno["db_size"] = "-1";
    $retorno["db_log_size"] = "-1";
    /*
      $retorno["lista_principal"] = "*";
      $retorno["lista_activa"] = "*";
      $retorno["productos"] = "-1";
      $retorno["enlace"] = "true";
      $retorno["servidor"] = "true";
     */


    $result1 = mssql_fetch_array(mssql_query("with jobsl as (
SELECT job_id, name, (SELECT TOP 1 run_status FROM [msdb].[dbo].[sysjobhistory] where step_id = 0 AND job_id = [msdb].[dbo].[sysjobs].[job_id] ORDER BY run_date DESC, run_time DESC) as last_status FROM 
    [msdb].[dbo].[sysjobs] 
)
SELECT COUNT(*) AS jobs
, (SELECT COUNT(*) FROM  sys.databases WHERE state > 0) AS dbs
, (SELECT sum(size * 8.0 / 1024)/1024 FROM sys.master_files WHERE type = 0 ) AS db_gb
, (SELECT sum(size * 8.0 / 1024)/1024 FROM sys.master_files WHERE type = 1 ) AS log_gb 
 FROM jobsl WHERE last_status = 0;", $link_mssql));

//print_r($result1);

    $retorno["jobs"] = $result1["jobs"];
    $retorno["db_status"] = $result1["dbs"];
    $retorno["db_size"] = $result1["db_gb"];
    $retorno["db_log_size"] = $result1["log_gb"];

    return $retorno;
}

function obtiene_lista_precios($oficina, $link_mssql) {

    $retorno["lista_activa"] = "*";
    $retorno["lista_principal"] = "*";
    $retorno["productos"] = "-1";

    /*
      $retorno["lista_principal"] = "*";
      $retorno["lista_activa"] = "*";
      $retorno["productos"] = "-1";
      $retorno["enlace"] = "true";
      $retorno["servidor"] = "true";
     */


    $result1 = mssql_fetch_array(mssql_query("SELECT lista_principal, 
(SELECT TOP 1 lista_precio from [EasyGestionEmpresarial].[dbo].[pv_lista_precio_oficina] WHERE oficina = '" . $oficina . "' AND estado = 'activo') AS lista_activa,
(SELECT COUNT(*) FROM [EasyGestionEmpresarial].[dbo].[TBL_PRECIOS_SUCURSALES] WHERE sucursal = (SELECT TOP 1 lista_precio from [EasyGestionEmpresarial].[dbo].[pv_lista_precio_oficina] WHERE oficina = '" . $oficina . "' AND estado = 'activo')) as productos 
FROM [EasyGestionEmpresarial].[dbo].[Oficina] WHERE oficina = '" . $oficina . "'", $link_mssql));

//print_r($result1);

    $retorno["lista_principal"] = $result1["lista_principal"];
    $retorno["lista_activa"] = $result1["lista_activa"];
    $retorno["productos"] = $result1["productos"];

    return $retorno;
}

?>
