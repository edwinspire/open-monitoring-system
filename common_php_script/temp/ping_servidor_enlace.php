<?php

include_once('Ping.php');

use JJG\Ping as Ping;

function ping_enlace($ip_server) {

    $retorno = "true";
    $ip_enlace = "0.0.0.0";

    list($a, $b, $c, $d) = sscanf($ip_server, "%d.%d.%d.%d");
    $ip_enlace = $a . "." . $b . "." . $c . "." . ($d - 1);

    if (Net_CheckIP::check_ip($ip_enlace)) {

        $ping = new Ping($ip_enlace);
        $p = $ping->ping();
        if ($p === false || $p < 1) {
            $retorno = "false";
        }
    } else {
        echo "La IP del enlace " . $ip_enlace . " no es válida\n\r";
    }

    return $retorno;
}

function ping_server($ip_server) {

    $retorno = "true";

    if (Net_CheckIP::check_ip($ip_server)) {

        $ping = new Ping($ip_server);
        $p = $ping->ping();

        if ($p === false || $p < 1) {
            $retorno = "false";
        }
    } else {
        echo "La IP del servidor " . $ip_server . " no es válida\n\r";
    }

    return $retorno;
}

?>
