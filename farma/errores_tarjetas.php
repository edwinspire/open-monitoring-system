<?php
header('Content-type: application/json');
if (($handle = fopen("errores_tarjetas.csv", "r")) !== FALSE) {

$arr = array();

    while (($data = fgetcsv($handle, 0, ",")) !== FALSE) {
$job = array("error_cod" => $data[0], "error_msg" => $data[1], "error_descrip" => $data[2], "error_solucion" => $data[3]);
array_push($arr, $job);        
    }
    fclose($handle);

$result = array('items' => $arr);

echo json_encode($result);
}

?> 
