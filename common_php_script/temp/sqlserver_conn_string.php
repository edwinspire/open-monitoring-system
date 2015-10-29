<?php

ini_set('display_errors', 1);
$serverName = "192.168.238.159"; //serverName\instanceName
$connectionInfo = array("Database" => "easygestionempresarial", "UID" => "sa", "PWD" => "sqlfarma");
$conn = sqlsrv_connect($serverName, $connectionInfo);

if ($conn) {
    echo "Conexión establecida.<br />";
} else {
    echo "Conexión no se pudo establecer.<br />";
    die(print_r(sqlsrv_errors(), true));
}
?>
