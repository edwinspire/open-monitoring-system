<?php

ini_set('display_errors', 1);
echo "fsdfsd";
include "pg_conn_string.php";

//$pGdbconn = pg_connect($conn_string)  or die("Could not connect");
$year_email = "2015";
$month_email = "02";
$filex = "C:/Users/edelacruz/AppData/Roaming/Thunderbird/Profiles/8k8b048s.default/Mail/mail.farmaenlace.com/Inbox.sbd/ServerRaid.sbd/" . $year_email . "-" . $month_email;
echo $filex;
$handle = @fopen($filex, "r");

if ($handle) {

    $receiveTime = "1990-01-01 00:00:00";
    $hostName = "0.0.0.0";
    $productType = "";
    $description = "";
//$line = 0;
//fseek($handle, 11421171);

    while (($buffer = fgets($handle, 1024)) !== false) {

        if (preg_match('/receiveTime=(?<year>[\d]+)\/(?<month>[\d]+)\/(?<day>[\d]+) (?<hour>[\d]+):(?<minute>[\d]+):(?<seconds>[\d]+)/', $buffer, $matches)) {
            $receiveTime = $matches["year"] . "-" . $matches["month"] . "-" . $matches["day"] . " " . $matches["hour"] . ":" . $matches["minute"] . ":" . $matches["seconds"];
//echo $receiveTime."\n";
//print_r($matches);
        }

        if (preg_match('/hostName=(?<hostName>[\d.]+)/', $buffer, $matches)) {
            $hostName = $matches["hostName"];
//echo $hostName."\n";
//print_r($matches);
        }


        if (preg_match('/productType=(?<productType>[\w\d: -.]+)/', $buffer, $matches)) {
            $productType = $matches["productType"];
//echo $productType."\n";
//print_r($matches);
        }

        if (preg_match('/description=(?<description>[\w\d: -.]+)/', $buffer, $matches)) {
            $description = $matches["description"];
//echo $receiveTime." ".$hostName." ".$productType."\n";
//echo $description."\n";

            /*
              fun_serverraid_import_from_email(
              ioficina text,
              ireceivetime timestamp without time zone,
              ihostname text,
              iproducttype text,
              idescription text,
              iline integer,
              ifile text)
             */
            $line = ftell($handle);


            $result = pg_query_params($pGdbconn, 'fun_serverraid_import_from_email(
    $1::timestamp without time zone,
    $2::text,
    $3::text,
    $4::text,
    $5::integer,
    $6::text)', array($receiveTime, $hostName, $productType, $description, $line, $file));
            $val = pg_fetch_result($result, 0, 0);
            echo 'Server Raid '.$val' importado<br/>';

            unset($receiveTime);
            unset($hostName);
            unset($productType);
            unset($description);

//echo ftell($handle); 
//print_r($matches);
        }


        // $line++;
    }
    if (!feof($handle)) {
        echo "Error: unexpected fgets() fail\n";
    }
    fclose($handle);
}

/*
  receiveTime=2015/03/13 18:58:10
  hostName=192.168.11.34
  productType=AMD Chipset SATA Controller - Controller 1
  description=Port 4 target 1 unplugged.
 */
?>
