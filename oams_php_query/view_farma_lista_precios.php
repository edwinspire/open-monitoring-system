<?php
require_once "../oams_php_script_private/oams_db.php";
header('Content-type: application/json');

$listapartipantes  = "474
477
028
029
050
059
062
064
076
077
078
079
080
102
103
108
113
114
126
130
139
153
175
182
189
190
193
200
211
265
266
269
307
308
310
346
352
369
372
383
390
398
402
416
425
435
441
453
468
470
473
485
487";



    $db = new oamsDB();
    $db->connect();
//   $db->mapper_table();
$result = array();

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

}

          

echo $result;

}
