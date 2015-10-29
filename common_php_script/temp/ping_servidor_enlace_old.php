<?php

include "pg_conn_string.php";
include_once('Ping.php');

use JJG\Ping as Ping;

//error_reporting(0);

$pGdbconn_get_lista_ip_servers = pg_connect($conn_string) or die("Could not connect");
$result = pg_prepare($pGdbconn_get_lista_ip_servers, "my_query", 'INSERT INTO ping(oficina, ip_server_farmacia, latencia_server_farmacia, 
            ip_enlace, latencia_enlace_farmacia) VALUES ($1::text, $2::text, $3::integer, $4::text, $5::integer);');

$ips_farmacias1 = pg_query_params($pGdbconn_get_lista_ip_servers, "SELECT oficina, ip_server_farmacia FROM server_159.oficina WHERE estado = 'A'", array());

while ($row_ip_farmacia1 = pg_fetch_array($ips_farmacias1)) {

    $ping_result = ping_server_enlace($row_ip_farmacia1['ip_server_farmacia']);
//break;

    $result = pg_execute($pGdbconn_get_lista_ip_servers, "my_query", array($row_ip_farmacia1["oficina"], $row_ip_farmacia1["ip_server_farmacia"], $ping_result["latencia_server_farmacia"], $ping_result["ip_enlace"], $ping_result["latencia_enlace_farmacia"]));
//break;
}

function ping_server_enlace($ip) {

    $ip_enlace = "0.0.0.0";
    $latencia_enlace_farmacia = "-1";
    $latencia_server_farmacia = "-1";

    if ($ip) {

        list($a, $b, $c, $d) = sscanf($ip, "%d.%d.%d.%d");
        $ip_enlace = $a . "." . $b . "." . $c . "." . ($d - 1);

        $ping = new Ping($ip);
        $latencia_server_farmacia = $ping->ping();
        if ($latencia_server_farmacia === false) {
            $latencia_server_farmacia = -1;
        }

        if (($d - 1) >= 0) {
            $ping->setHost($ip_enlace);
            $latencia_enlace_farmacia = $ping->ping();
            if ($latencia_enlace_farmacia === false) {
                $latencia_enlace_farmacia = -1;
            }
        }
    }

    return array("latencia_server_farmacia" => $latencia_server_farmacia, "ip_enlace" => $ip_enlace, "latencia_enlace_farmacia" => $latencia_enlace_farmacia);
}

?>
