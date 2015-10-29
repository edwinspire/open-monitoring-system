<?php

//ini_set('display_errors', 1);
include "pg_conn_string.php";
//$row = 1;

if (($handle = fopen("D:/sqlserver-csv/comprobar_integridad.csv", "r")) !== FALSE) {

    $pGdbconn = pg_connect($conn_string) or die("Could not connect");

    echo 'Importando ComprobarIntegridad a la base de datos <br/>';

    while (($data = fgetcsv($handle, 512, ";")) !== FALSE) {
        /*
          echo   $data[0];  // Fecha
          echo   $data[1]; // Farmacia
          echo   $data[2]; // Nombre
          echo   $data[3]; // Tiempo
          echo   $data[4]; // Estado
          echo   '<br/>';
         */
// fun_job_comprobar_integridad_insert(   ioficina text,    ifecha_hora timestamp without time zone,    itiempo interval,    iestado text)
        $result = pg_query_params($pGdbconn, 'SELECT fun_job_comprobar_integridad_insert($1::text, $2::timestamp without time zone, $3::interval, $4::text);', array($data[1], $data[0], $data[3], $data[4]));
        $val = pg_fetch_result($result, 0, 0);

        echo 'Registro ' . $val . ' insertado<br/>';
    }
    fclose($handle);
}
?> 
