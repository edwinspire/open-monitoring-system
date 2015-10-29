<?php

include "pg_conn_string.php";
//error_reporting(0);
/*
  fun_db_status_insert_update(ioficina text,
  ibdgeneral_size_db integer,
  ibdgeneral_size_log integer,
  ibdgeneral_state integer,
  ibdgeneral_state_desc text,
  icash_management_size_db integer,
  icash_management_size_log integer,
  icash_management_state integer,
  icash_management_state_desc text,
  icatalogo_size_db integer,
  icatalogo_size_log integer,
  icatalogo_state integer,
  icatalogo_state_desc text,
  ifarma_repositorio_size_db integer,
  ifarma_repositorio_size_log integer,
  ifarma_repositorio_state integer,
  ifarma_repositorio_state_desc text,
  ieasy_contabilidad_size_db integer,
  ieasy_contabilidad_size_log integer,
  ieasy_contabilidad_state integer,
  ieasy_contabilidad_state_desc text,
  ieasy_facturas_data_size_db integer,
  ieasy_facturas_data_size_log integer,
  ieasy_facturas_data_state integer,
  ieasy_facturas_data_state_desc text,
  igestion_empresarial_size_db integer,
  igestion_empresarial_size_log integer,
  igestion_empresarial_state integer,
  igestion_empresarial_state_desc text,
  igestion_historico_size_db integer,
  igestion_historico_size_log integer,
  igestion_historico_state integer,
  igestion_historico_state_desc text,
  ieasy_pagos_size_db integer,
  ieasy_pagos_size_log integer,
  ieasy_pagos_state integer,
  ieasy_pagos_state_desc text,
  ieasy_seguridad_size_db integer,
  ieasy_seguridad_size_log integer,
  ieasy_seguridad_state integer,
  ieasy_seguridad_state_desc text,
  ifarma_estadistica_ventas_size_db integer,
  ifarma_estadistica_ventas_size_log integer,
  ifarma_estadistica_ventas_state integer,
  ifarma_estadistica_ventas_state_desc text,
  imedicacion_frecuente_size_db integer,
  imedicacion_frecuente_size_log integer,
  imedicacion_frecuente_state integer,
  imedicacion_frecuente_state_desc text,
  imovimientos_boveda_caja_size_db integer,
  imovimientos_boveda_caja_size_log integer,
  imovimientos_boveda_state integer,
  imovimientos_boveda_state_desc text,
  iservicio_domicilio_size_db integer,
  iservicio_domicilio_size_log integer,
  iservicio_domicilio_state integer,
  iservicio_domicilio_state_desc text,
  ijob_failed integer,
  ijob_succeeded integer,
  ijob_retry integer,
  ijob_cancelled integer)

 */




$pGdbconn_get_lista_ip_servers = pg_connect($conn_string) or die("Could not connect");
$resultq = pg_prepare($pGdbconn_get_lista_ip_servers, "my_query_", "SELECT fun_db_status_insert_update($1::text, 
$2::double precision, 
$3::double precision, 
$4::integer, 
$5::text, 
$6::double precision, 
$7::double precision, 
$8::integer, 
$9::text, 
$10::double precision, 
$11::double precision, 
$12::integer, 
$13::text, 
$14::double precision, 
$15::double precision, 
$16::integer, 
$17::text, 
$18::double precision, 
$19::double precision, 
$20::integer, 
$21::text, 
$22::double precision, 
$23::double precision, 
$24::integer, 
$25::text, 
$26::double precision, 
$27::double precision, 
$28::integer, 
$29::text, 
$30::double precision, 
$31::double precision, 
$32::integer, 
$33::text, 
$34::double precision, 
$35::double precision, 
$36::integer, 
$37::text, 
$38::double precision, 
$39::double precision, 
$40::integer, 
$41::text, 
$42::double precision, 
$43::double precision, 
$44::integer, 
$45::text, 
$46::double precision, 
$47::double precision, 
$48::integer, 
$49::text, 
$50::double precision, 
$51::double precision, 
$52::integer, 
$53::text, 
$54::double precision, 
$55::double precision, 
$56::integer, 
$57::text, 
$58::double precision, 
$59::double precision, 
$60::double precision, 
$61::double precision);");

$result_dato_acceso_servers1 = pg_query_params($pGdbconn_get_lista_ip_servers, "SELECT oficina, ip_server_farmacia, nombre_db, usuario_db, clave_db FROM server_159.oficina WHERE estado = 'A'", array());

while ($row_dato_acceso_servers1 = pg_fetch_array($result_dato_acceso_servers1)) {
//print_r ($row_dato_acceso_servers1);

    $datos = obtiene_estado_db_desde_oficina($row_dato_acceso_servers1['oficina'], $row_dato_acceso_servers1['ip_server_farmacia'], $row_dato_acceso_servers1['usuario_db'], $row_dato_acceso_servers1['clave_db']);
//print_r ($datos);


    $resultq = pg_execute($pGdbconn_get_lista_ip_servers, "my_query_", array($datos["oficina"],
        $datos["bdgeneral_size_db"],
        $datos["bdgeneral_size_log"],
        $datos["bdgeneral_state"],
        $datos["bdgeneral_state_desc"],
        $datos["cash_management_size_db"],
        $datos["cash_management_size_log"],
        $datos["cash_management_state"],
        $datos["cash_management_state_desc"],
        $datos["catalogo_size_db"],
        $datos["catalogo_size_log"],
        $datos["catalogo_state"],
        $datos["catalogo_state_desc"],
        $datos["farma_repositorio_size_db"],
        $datos["farma_repositorio_size_log"],
        $datos["farma_repositorio_state"],
        $datos["farma_repositorio_state_desc"],
        $datos["easy_contabilidad_size_db"],
        $datos["easy_contabilidad_size_log"],
        $datos["easy_contabilidad_state"],
        $datos["easy_contabilidad_state_desc"],
        $datos["easy_facturas_data_size_db"],
        $datos["easy_facturas_data_size_log"],
        $datos["easy_facturas_data_state"],
        $datos["easy_facturas_data_state_desc"],
        $datos["gestion_empresarial_size_db"],
        $datos["gestion_empresarial_size_log"],
        $datos["gestion_empresarial_state"],
        $datos["gestion_empresarial_state_desc"],
        $datos["gestion_historico_size_db"],
        $datos["gestion_historico_size_log"],
        $datos["gestion_historico_state"],
        $datos["gestion_historico_state_desc"],
        $datos["easy_pagos_size_db"],
        $datos["easy_pagos_size_log"],
        $datos["easy_pagos_state"],
        $datos["easy_pagos_state_desc"],
        $datos["easy_seguridad_size_db"],
        $datos["easy_seguridad_size_log"],
        $datos["easy_seguridad_state"],
        $datos["easy_seguridad_state_desc"],
        $datos["farma_estadistica_ventas_size_db"],
        $datos["farma_estadistica_ventas_size_log"],
        $datos["farma_estadistica_ventas_state"],
        $datos["farma_estadistica_ventas_state_desc"],
        $datos["medicacion_frecuente_size_db"],
        $datos["medicacion_frecuente_size_log"],
        $datos["medicacion_frecuente_state"],
        $datos["medicacion_frecuente_state_desc"],
        $datos["movimientos_boveda_size_db"],
        $datos["movimientos_boveda_size_log"],
        $datos["movimientos_boveda_state"],
        $datos["movimientos_boveda_state_desc"],
        $datos["servicio_domicilio_size_db"],
        $datos["servicio_domicilio_size_log"],
        $datos["servicio_domicilio_state"],
        $datos["servicio_domicilio_state_desc"],
        $datos["job_failed"],
        $datos["job_succeeded"],
        $datos["job_retry"],
        $datos["job_cancelled"]));
//break;
}

function obtiene_estado_db_desde_oficina($oficina, $ip, $user, $pwd) {

    $retorno = array();

    $retorno["oficina"] = $oficina;
    $retorno["bdgeneral_size_db"] = -1;
    $retorno["bdgeneral_size_log"] = -1;
    $retorno["bdgeneral_state"] = -1;
    $retorno["bdgeneral_state_desc"] = "SIN RESPUESTA";
    $retorno["cash_management_size_db"] = -1;
    $retorno["cash_management_size_log"] = -1;
    $retorno["cash_management_state"] = -1;
    $retorno["cash_management_state_desc"] = "SIN RESPUESTA";
    $retorno["catalogo_size_db"] = -1;
    $retorno["catalogo_size_log"] = -1;
    $retorno["catalogo_state"] = -1;
    $retorno["catalogo_state_desc"] = "SIN RESPUESTA";
    $retorno["farma_repositorio_size_db"] = -1;
    $retorno["farma_repositorio_size_log"] = -1;
    $retorno["farma_repositorio_state"] = -1;
    $retorno["farma_repositorio_state_desc"] = "SIN RESPUESTA";
    $retorno["easy_contabilidad_size_db"] = -1;
    $retorno["easy_contabilidad_size_log"] = -1;
    $retorno["easy_contabilidad_state"] = -1;
    $retorno["easy_contabilidad_state_desc"] = "SIN RESPUESTA";
    $retorno["easy_facturas_data_size_db"] = -1;
    $retorno["easy_facturas_data_size_log"] = -1;
    $retorno["easy_facturas_data_state"] = -1;
    $retorno["easy_facturas_data_state_desc"] = "SIN RESPUESTA";
    $retorno["gestion_empresarial_size_db"] = -1;
    $retorno["gestion_empresarial_size_log"] = -1;
    $retorno["gestion_empresarial_state"] = -1;
    $retorno["gestion_empresarial_state_desc"] = "SIN RESPUESTA";
    $retorno["gestion_historico_size_db"] = -1;
    $retorno["gestion_historico_size_log"] = -1;
    $retorno["gestion_historico_state"] = -1;
    $retorno["gestion_historico_state_desc"] = "SIN RESPUESTA";
    $retorno["easy_pagos_size_db"] = -1;
    $retorno["easy_pagos_size_log"] = -1;
    $retorno["easy_pagos_state"] = -1;
    $retorno["easy_pagos_state_desc"] = "SIN RESPUESTA";
    $retorno["easy_seguridad_size_db"] = -1;
    $retorno["easy_seguridad_size_log"] = -1;
    $retorno["easy_seguridad_state"] = -1;
    $retorno["easy_seguridad_state_desc"] = "SIN RESPUESTA";
    $retorno["farma_estadistica_ventas_size_db"] = -1;
    $retorno["farma_estadistica_ventas_size_log"] = -1;
    $retorno["farma_estadistica_ventas_state"] = -1;
    $retorno["farma_estadistica_ventas_state_desc"] = "SIN RESPUESTA";
    $retorno["medicacion_frecuente_size_db"] = -1;
    $retorno["medicacion_frecuente_size_log"] = -1;
    $retorno["medicacion_frecuente_state"] = -1;
    $retorno["medicacion_frecuente_state_desc"] = "SIN RESPUESTA";
    $retorno["movimientos_boveda_size_db"] = -1;
    $retorno["movimientos_boveda_size_log"] = -1;
    $retorno["movimientos_boveda_state"] = -1;
    $retorno["movimientos_boveda_state_desc"] = "SIN RESPUESTA";
    $retorno["servicio_domicilio_size_db"] = -1;
    $retorno["servicio_domicilio_size_log"] = -1;
    $retorno["servicio_domicilio_state"] = -1;
    $retorno["servicio_domicilio_state_desc"] = "SIN RESPUESTA";

    $retorno["job_failed"] = -1;
    $retorno["job_succeeded"] = -1;
    $retorno["job_retry"] = -1;
    $retorno["job_cancelled"] = -1;
    $retorno["job_running"] = -1;

//echo $ip."\n\r";
    if (strlen($ip) > 7) {

        $link_oficina = mssql_connect($ip, $user, $pwd);

        if ($link_oficina) {

            $r1 = mssql_query("with fs
as
(
    select database_id, type, size * 8.0 / 1024 size
    from sys.master_files
)

select 
    name, state, state_desc, 
    (select sum(size) from fs where type = 0 and fs.database_id = db.database_id) DataFileSizeMB,
    (select sum(size) from fs where type = 1 and fs.database_id = db.database_id) LogFileSizeMB
from sys.databases db");


            while ($row_db = mssql_fetch_assoc($r1)) {
//  print_r($row_db);

                switch ($row_db["name"]) {
                    case "bdgeneral":
                        $retorno["bdgeneral_size_db"] = $row_db["DataFileSizeMB"];
                        $retorno["bdgeneral_size_log"] = $row_db["LogFileSizeMB"];
                        $retorno["bdgeneral_state"] = $row_db["state"];
                        $retorno["bdgeneral_state_desc"] = $row_db["state_desc"];
                        break;
                    case "CashManagement":
                        $retorno["cash_management_size_db"] = $row_db["DataFileSizeMB"];
                        $retorno["cash_management_size_log"] = $row_db["LogFileSizeMB"];
                        $retorno["cash_management_state"] = $row_db["state"];
                        $retorno["cash_management_state_desc"] = $row_db["state_desc"];
                        break;
                    case "EasyContabilidad":
                        $retorno["easy_contabilidad_size_db"] = $row_db["DataFileSizeMB"];
                        $retorno["easy_contabilidad_size_log"] = $row_db["LogFileSizeMB"];
                        $retorno["easy_contabilidad_state"] = $row_db["state"];
                        $retorno["easy_contabilidad_state_desc"] = $row_db["state_desc"];
                        break;
                    case "EasyFacturas_Data":
                        $retorno["easy_facturas_data_size_db"] = $row_db["DataFileSizeMB"];
                        $retorno["easy_facturas_data_size_log"] = $row_db["LogFileSizeMB"];
                        $retorno["easy_facturas_data_state"] = $row_db["state"];
                        $retorno["easy_facturas_data_state_desc"] = $row_db["state_desc"];
                        break;
                    case "EasyGestionEmpresarial":
                        $retorno["gestion_empresarial_size_db"] = $row_db["DataFileSizeMB"];
                        $retorno["gestion_empresarial_size_log"] = $row_db["LogFileSizeMB"];
                        $retorno["gestion_empresarial_state"] = $row_db["state"];
                        $retorno["gestion_empresarial_state_desc"] = $row_db["state_desc"];
                        break;
                    case "EasyPagos":
                        $retorno["easy_pagos_size_db"] = $row_db["DataFileSizeMB"];
                        $retorno["easy_pagos_size_log"] = $row_db["LogFileSizeMB"];
                        $retorno["easy_pagos_state"] = $row_db["state"];
                        $retorno["easy_pagos_state_desc"] = $row_db["state_desc"];
                        break;
                    case "Easypagos":
                        $retorno["easy_pagos_size_db"] = $row_db["DataFileSizeMB"];
                        $retorno["easy_pagos_size_log"] = $row_db["LogFileSizeMB"];
                        $retorno["easy_pagos_state"] = $row_db["state"];
                        $retorno["easy_pagos_state_desc"] = $row_db["state_desc"];
                        break;
                    case "EasySeguridad":
                        $retorno["easy_seguridad_size_db"] = $row_db["DataFileSizeMB"];
                        $retorno["easy_seguridad_size_log"] = $row_db["LogFileSizeMB"];
                        $retorno["easy_seguridad_state"] = $row_db["state"];
                        $retorno["easy_seguridad_state_desc"] = $row_db["state_desc"];
                        break;
                    case "FARMAESTADISTICA_VENTAS":
                        $retorno["farma_estadistica_ventas_size_db"] = $row_db["DataFileSizeMB"];
                        $retorno["farma_estadistica_ventas_size_log"] = $row_db["LogFileSizeMB"];
                        $retorno["farma_estadistica_ventas_state"] = $row_db["state"];
                        $retorno["farma_estadistica_ventas_state_desc"] = $row_db["state_desc"];
                        break;
                    case "D:\BASE REPOSITORIO\FARMA_REPOSITORIO.MDF":
                        $retorno["farma_repositorio_size_db"] = $row_db["DataFileSizeMB"];
                        $retorno["farma_repositorio_size_log"] = $row_db["LogFileSizeMB"];
                        $retorno["farma_repositorio_state"] = $row_db["state"];
                        $retorno["farma_repositorio_state_desc"] = $row_db["state_desc"];
                        break;
                    case "D:\Base Repositorio\FARMA_REPOSITORIO.MDF":
                        $retorno["farma_repositorio_size_db"] = $row_db["DataFileSizeMB"];
                        $retorno["farma_repositorio_size_log"] = $row_db["LogFileSizeMB"];
                        $retorno["farma_repositorio_state"] = $row_db["state"];
                        $retorno["farma_repositorio_state_desc"] = $row_db["state_desc"];
                        break;
                    case "D:\Base Repositorio\FARMA_Repositorio.MDF":
                        $retorno["farma_repositorio_size_db"] = $row_db["DataFileSizeMB"];
                        $retorno["farma_repositorio_size_log"] = $row_db["LogFileSizeMB"];
                        $retorno["farma_repositorio_state"] = $row_db["state"];
                        $retorno["farma_repositorio_state_desc"] = $row_db["state_desc"];
                        break;
                    case "D:\base repositorio\FARMA_REPOSITORIO.MDF":
                        $retorno["farma_repositorio_size_db"] = $row_db["DataFileSizeMB"];
                        $retorno["farma_repositorio_size_log"] = $row_db["LogFileSizeMB"];
                        $retorno["farma_repositorio_state"] = $row_db["state"];
                        $retorno["farma_repositorio_state_desc"] = $row_db["state_desc"];
                        break;
                    case "EasyGestionHistorico":
                        $retorno["gestion_historico_size_db"] = $row_db["DataFileSizeMB"];
                        $retorno["gestion_historico_size_log"] = $row_db["LogFileSizeMB"];
                        $retorno["gestion_historico_state"] = $row_db["state"];
                        $retorno["gestion_historico_state_desc"] = $row_db["state_desc"];
                        break;
                    case "ServicioDomicilio":
                        $retorno["servicio_domicilio_size_db"] = $row_db["DataFileSizeMB"];
                        $retorno["servicio_domicilio_size_log"] = $row_db["LogFileSizeMB"];
                        $retorno["servicio_domicilio_state"] = $row_db["state"];
                        $retorno["servicio_domicilio_state_desc"] = $row_db["state_desc"];
                        break;
                    case "Catalogo":
                        $retorno["catalogo_size_db"] = $row_db["DataFileSizeMB"];
                        $retorno["catalogo_size_log"] = $row_db["LogFileSizeMB"];
                        $retorno["catalogo_state"] = $row_db["state"];
                        $retorno["catalogo_state_desc"] = $row_db["state_desc"];
                        break;
                    case "MovimientosBovedaCaja":
                        $retorno["movimientos_boveda_size_db"] = $row_db["DataFileSizeMB"];
                        $retorno["movimientos_boveda_size_log"] = $row_db["LogFileSizeMB"];
                        $retorno["movimientos_boveda_state"] = $row_db["state"];
                        $retorno["movimientos_boveda_state_desc"] = $row_db["state_desc"];
                        break;
                    case "MedicacionFrecuente":
                        $retorno["medicacion_frecuente_size_db"] = $row_db["DataFileSizeMB"];
                        $retorno["medicacion_frecuente_size_log"] = $row_db["LogFileSizeMB"];
                        $retorno["medicacion_frecuente_state"] = $row_db["state"];
                        $retorno["medicacion_frecuente_state_desc"] = $row_db["state_desc"];
                        break;
                }
            }

            mssql_free_result($r1);


            $r2 = mssql_query("with jobs as (
SELECT job_id, name, (SELECT TOP 1 run_status FROM [msdb].[dbo].[sysjobhistory] where step_id = 0 AND job_id = [msdb].[dbo].[sysjobs].[job_id] ORDER BY run_date DESC, run_time DESC) as last_status FROM 
    [msdb].[dbo].[sysjobs] 
)

select top 1 (SELECT count(*) FROM jobs WHERE last_status = 0) as job_failed, (SELECT count(*) FROM jobs WHERE last_status = 1) as job_succeeded, (SELECT count(*) FROM jobs WHERE last_status = 2) as job_retry, (SELECT count(*) FROM jobs WHERE last_status = 3) as job_cancelled, (SELECT count(*) FROM jobs WHERE last_status = 4) as job_running from jobs ");
            $jobs = mssql_fetch_array($r2, MSSQL_ASSOC);

//  print_r($jobs);
            $retorno["job_failed"] = $jobs["job_failed"];
            $retorno["job_succeeded"] = $jobs["job_succeeded"];
            $retorno["job_retry"] = $jobs["job_retry"];
            $retorno["job_cancelled"] = $jobs["job_cancelled"];
            $retorno["job_running"] = $jobs["job_running"];

            mssql_free_result($r2);
//print_r ($resultado);
        } else {
            echo("Unable to connect! Oficina " . $oficina . " => IP " . $ip . "\n\r");
        }
    } else {
        echo "Oficina " . $oficina . " => IP invalida " . $ip . "\n\r";
    }

    return $retorno;
}

?>
