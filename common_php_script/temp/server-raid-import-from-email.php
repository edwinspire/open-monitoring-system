<?php

include "pg_conn_string.php";

$pGdbconn1 = pg_connect($conn_string) or die("Could not connect");

//$time=strtotime($dateValue);
//$month=date("F",$time);
//$year=date("Y",$time);
//$year_email = "2015";
//$month_email = "03";
//$filex = "C:/Users/edelacruz/AppData/Roaming/Thunderbird/Profiles/8k8b048s.default/Mail/mail.farmaenlace.com/Inbox.sbd/ServerRaid.sbd/Automaticos";
$filex = "/home/edwinspire/.icedove/vfan9dok.default/Mail/mail.farmaenlace.com/Inbox.sbd/ServerRaid.sbd/Automaticos";

$handle = fopen($filex, "r");

if ($handle) {
//echo "llega hasta aqui </br>";
    $result = pg_query_params($pGdbconn1, 'SELECT line_file FROM server_raid_reporte WHERE file = $1::text ORDER BY line_file DESC LIMIT 1;', array($filex));
    $leer_desde = pg_fetch_result($result, 0, 0);

    if ($leer_desde == null || $leer_desde < 0) {
        $leer_desde = 0;
    }

    fseek($handle, $leer_desde);

//echo "Empeza desde el punto ".$leer_desde."</br>";

    $receiveTime = "1990-01-01 00:00:00";
    $hostName = "0.0.0.0";
    $productType = "";
    $description = "";

    while (($buffer = fgets($handle, 1024)) !== false) {

        if (preg_match('/receiveTime=(?<year>[\d]+)\/(?<month>[\d]+)\/(?<day>[\d]+) (?<hour>[\d]+):(?<minute>[\d]+):(?<seconds>[\d]+)/', $buffer, $matches)) {
            $receiveTime = $matches["year"] . "-" . $matches["month"] . "-" . $matches["day"] . " " . $matches["hour"] . ":" . $matches["minute"] . ":" . $matches["seconds"];
        }

        if (preg_match('/hostName=(?<hostName>[\d.]+)/', $buffer, $matches)) {
            $hostName = $matches["hostName"];
        }


        if (preg_match('/productType=(?<productType>[\w\d: -.]+)/', $buffer, $matches)) {
            $productType = $matches["productType"];
        }

        if (preg_match('/description=(?<description>[\w\d: -.]+)/', $buffer, $matches)) {
            $description = $matches["description"];
            $line = ftell($handle);

            $result = pg_query_params($pGdbconn1, 'SELECT fun_serverraid_import_from_email($1::timestamp without time zone, $2::text, $3::text, $4::text, $5::integer, $6::text)', array($receiveTime, $hostName, $productType, $description, $line, $filex));
            $val = pg_fetch_result($result, 0, 0);
        }
    }

    if (!feof($handle)) {
        echo "Error: unexpected fgets() fail\n";
    }
    fclose($handle);
} else {
//echo "No vale </br>";
}

/*
  receiveTime=2015/03/13 18:58:10
  hostName=192.168.11.34
  productType=AMD Chipset SATA Controller - Controller 1
  description=Port 4 target 1 unplugged.
 */
?>
