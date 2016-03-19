<?php

ini_set('display_errors', -1);
include_once("pguDC.php");
$oams_config = parse_ini_file("oams.ini.php");

class uDCGridx extends pguDC {

public function structure($fields){

$rstructure = "[]";

$f = array_keys($fields);
$fields_as_string = implode(",", $f);

$result_field = pg_query_params($this->connection, "SELECT * FROM udc_tables_columns WHERE table_name = $1::TEXT AND column_name = ANY($2::TEXT[]);", array($this->table_name, "{".$fields_as_string."}"));

$columns = array();

while ($row = pg_fetch_array($result_field , null, PGSQL_ASSOC)){ 

// Verificamos que el campo actual esta entre los solicitados
if(array_key_exists($row["column_name"], $fields)){

// Busca en que posicion va a aparecer el campo
$colpos = array_search($row["column_name"], $f);

if($colpos >= 0){

if(strlen($row["column_width"])>0){
$jsw = "'width': '".$row["column_width"]." '";
}else{
$jsw = "'width': 'auto' ";
}

$editable = false;
if(array_key_exists($row["column_name"], $fields) && ($fields[$row["column_name"]] == true)){
$editable = true;
}

$jsstructure = array();

$jsstructure['field'] = $row["column_name"];
$jsstructure['name'] = $row["column_label"];

switch($row["data_type"]){
	case "timestamp without time zone":

$datepattern = "yyyy-MM-dd HH:mm:ss";
$decorator = "function(value)
{
  try {
    if (value) {
      var dt = new Date(value.replace('T', ' '));
return _3.format(dt, { selector: \"date\", datePattern: \"".$datepattern."\"}); 
    }
  } catch (e) {
    console.error('error decorating date: ' + e.toString());
  }
}";

$jsstructure['dataType'] = 'datetime';
$jsstructure['decorator'] = $decorator;

if($editable){
$jsstructure['editable'] = true;
}

	break;
	case "boolean":
$jsstructure['dataType'] = 'boolean';
$jsstructure['editor'] = 'dijit/form/CheckBox';
$jsstructure['alwaysEditing'] = true;

if($editable){
$jsstructure['editorArgs'] = array("props"=>'value: true, disabled: \"true\"');
}else{
$jsstructure['editorArgs'] = array("props"=>'value: true');
$jsstructure['editable'] = true;
}

	break;

	default:
$jsstructure['editable'] = $editable;
	break;
}

$columns[$colpos] = $jsstructure;

}


}

}

ksort($columns);
return json_encode($columns);
}


}

?>
