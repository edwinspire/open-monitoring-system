<?php
ini_set('display_errors', 0);
include "../../uDC/pguDC.php";
header('Content-type: application/json');

$listapartipantes  = "347
306
381
348
409
463
371
438
420
382
386
408
345
320
330
344
385
377
431
410
426
446
158
412
119
384
354
436
429
467
434
490
351
";



    $db = new pguDCGrid();
    $db->connect();
//   $db->mapper_table();
$result = "{'action': 'none', 'error': 'Ninguna accion realizada'}";

	if(!$db->access_control(0)){
header('HTTP/1.1 401 Unauthorized', true, 401);
                        die();
}else{


//print_r($_GET);
//    $result = pg_query_params($pGdbconn, "SELECT * FROM view_events_monitor LIMIT 200;", array());
switch($_GET['seleccion']){
case 'eco':
  $result = $db->query_params_result_as_json("SELECT * FROM view_farma_lista_precios WHERE account_name ILIKE  'ECO%'  ORDER BY account", array());
break;
case 'medi':
  $result = $db->query_params_result_as_json("SELECT * FROM view_farma_lista_precios WHERE account_name ILIKE  'MED%'  ORDER BY account", array());
break;
case 'paf':
  $result = $db->query_params_result_as_json("SELECT * FROM view_farma_lista_precios WHERE account_name ILIKE  'PAF%'  ORDER BY account", array());
break;
case 'difarmes':
  $result = $db->query_params_result_as_json("SELECT * FROM view_farma_lista_precios WHERE account_name ILIKE  'DIFAR%'  ORDER BY account", array());
break;
case 'pnatural':
  $result = $db->query_params_result_as_json("SELECT * FROM view_farma_lista_precios WHERE account_name ILIKE  'PUNTO %'  ORDER BY account", array());
break;
case 'promo':

$participantes = explode("\n", $listapartipantes);
$p =  "{".str_replace (array('[', ']'), "", json_encode($participantes))."}";
//echo $p;

  $result = $db->query_params_result_as_json("SELECT * FROM view_farma_lista_precios WHERE account = ANY($1::text[]) AND account_name NOT ILIKE 'CAPACITA%' ORDER BY account", array($p));
break;
default:

if($_POST["udc_action"] == "grid_export"){

//print_r(json_decode($_POST["udc_selected_id"]));
$db->use_table("view_farma_lista_precios");
header('Content-type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
header("Content-Disposition:attachment;filename=report.xlsx");
//($header = true, $title = "", $return_fields = array(), $where = array(), $orderby="", $limit = 0, $and_field_any = "", $and_values_any = array())
$result = $db->export_as_xlsx(true, "Lista de precios", array(), array(), "account_name", 0, "idaccount", json_decode($_POST["udc_selected_id"]));

}

break;
}

         

echo $result;

}
