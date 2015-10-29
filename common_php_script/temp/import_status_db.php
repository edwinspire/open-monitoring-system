<?php

include "pg_conn_string.php";
//error_reporting(0);
$pGdbconn_get_lista_ip_servers = pg_connect($conn_string) or die("Could not connect postgres server");

$resultq1 = pg_prepare($pGdbconn_get_lista_ip_servers, "query_insert_job_estado", "SELECT fun_jobs_farmacias_estado_historial_insert($1::text,
  $2::text,
  $3::integer,
  $4::text,
  $5::timestamp without time zone,
  $6::integer);");

$resultq2 = pg_prepare($pGdbconn_get_lista_ip_servers, "query_insert_db_estado", "INSERT INTO db_status_history(
            oficina, db_name, db_size, log_size, db_state, db_state_desc)
    VALUES ( $1::text,
  $2::text,
  $3::double precision,
  $4::double precision,
  $5::integer,
  $6::text);");

$result_dato_acceso_servers1 = pg_query_params($pGdbconn_get_lista_ip_servers, "SELECT oficina, ip_server_farmacia, nombre_db, usuario_db, clave_db FROM server_159.oficina WHERE estado = 'A'", array());

while ($row_dato_acceso_servers1 = pg_fetch_array($result_dato_acceso_servers1)) {
    $datos = obtiene_estado_db_desde_oficina($row_dato_acceso_servers1['oficina'], $row_dato_acceso_servers1['ip_server_farmacia'], $row_dato_acceso_servers1['usuario_db'], $row_dato_acceso_servers1['clave_db'], $pGdbconn_get_lista_ip_servers);
}

function obtiene_estado_db_desde_oficina($oficina, $ip, $user, $pwd, $link_postgres) {

    $retorno = array();


    if (Net_CheckIP::check_ip($ip)) {

        echo "Conectando a la oficina " . $oficina . " IP: " . $ip . "\n\r";
        $link_oficina = mssql_connect($ip, $user, $pwd);

        if ($link_oficina) {

//** Importa la lista de jobs y el ultimo estado **//
            import_lista_job_datos($link_oficina, $link_postgres, $oficina);
//** Importa es estado de las bases de datos **//
            import_lista_db_estado($link_oficina, $link_postgres, $oficina);
        } else {
            echo("Unable to connect! Oficina " . $oficina . " => IP " . $ip . "\n\r");
        }
    } else {
        echo "Oficina " . $oficina . " => IP invalida " . $ip . "\n\r";
    }

    return $retorno;
}

// Usa uan conexion activa
function import_lista_job_datos($link_oficina_mssql, $link_postgres, $oficina) {

    $retorno = array();

    if ($link_oficina_mssql) {

        $r1 = mssql_query("select distinct j.Name as job_name, j.description as job_desc,
h.run_duration as job_duration,
 CONVERT(VARCHAR,DATEADD(S,(run_time/10000)*60*60 /* hours */  
          +((run_time - (run_time/10000) * 10000)/100) * 60 /* mins */  
          + (run_time - (run_time/100) * 100)  /* secs */
           ,CONVERT(DATETIME,RTRIM(run_date),113)),120) AS job_date,
		   h.run_status as job_status,
case h.run_status 
when 0 then 'Failed' 
when 1 then 'Successful' 
when 3 then 'Cancelled' 
when 4 then 'In Progress' 
end as job_status_desc
from msdb..sysJobHistory h, msdb..sysJobs j, msdb..syscategories cat
where j.job_id = h.job_id and
j.category_id = cat.category_id
and h.step_id = 1
and h.run_date = 
(select max(hi.run_date) from msdb..sysJobHistory hi where h.job_id = hi.job_id)
and h.run_time =
(select max(hj.run_time) from msdb..sysJobHistory hj where h.job_id = hj.job_id)");

        while ($row_job = mssql_fetch_assoc($r1)) {

            $resultq = pg_execute($link_postgres, "query_insert_job_estado", array($oficina, utf8_encode($row_job["job_name"]), $row_job["job_status"], utf8_encode($row_job["job_status_desc"]), $row_job["job_date"], $row_job["job_duration"]));
        }

        mssql_free_result($r1);
    }
}

// Usa una conexion activa
function import_lista_db_estado($link_oficina_mssql, $link_postgres, $oficina) {

    $retorno = array();

    if ($link_oficina_mssql) {

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
//oficina, db_name, db_size, log_size, db_state, db_state_desc)
            $resultq = pg_execute($link_postgres, "query_insert_db_estado", array($oficina, utf8_encode($row_db["name"]), $row_db["DataFileSizeMB"], $row_db["LogFileSizeMB"], $row_db["state"], utf8_encode($row_db["state_desc"])));
        }

        mssql_free_result($r1);
    }
}

?>
