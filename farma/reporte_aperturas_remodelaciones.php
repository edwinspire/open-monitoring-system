<?php
header('Content-type: application/json');
if (($handle = fopen("reporte_aperturas_remodelaciones.csv", "r")) !== FALSE) {

$arr = array();

    while (($data = fgetcsv($handle, 0, ",")) !== FALSE) {
$job = array("farmacia" => $data[0], "cuidad" => $data[1], "tecnico" => $data[2], "pv" => $data[3], "pd" => $data[4], "srv" => $data[5], "fetransporte" => $data[6], "finstalacion" => $data[7], "fapertura" => $data[8], "pf" => $data[9], "proyectos" => $data[10], "tipo" => $data[11], "ejecucion" => $data[12], "comentarios" => $data[13]);
array_push($arr, $job);        
    }
    fclose($handle);

$result = array('items' => $arr);

echo json_encode($result);
}

?> 
